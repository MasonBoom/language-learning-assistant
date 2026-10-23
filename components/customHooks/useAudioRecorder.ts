"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type RecordingStatus = "idle" | "requesting" | "recording" | "stopping" | "processing";
type RecordingHandler = (audio: Blob, signal: AbortSignal) => Promise<void>;

function discardRecorder(recorder: MediaRecorder | null) {
  if (!recorder) return;
  recorder.ondataavailable = null;
  recorder.onstop = null;
  recorder.onerror = null;
  if (recorder.state !== "inactive") {
    try { recorder.stop(); } catch { /* Tracks are released by the caller. */ }
  }
}

function microphoneError(error: unknown): string {
  const name = error instanceof Error ? error.name : "";
  if (name === "NotAllowedError" || name === "SecurityError") {
    return "Microphone access was denied. Allow microphone access in your browser's site settings, then try again.";
  }
  if (name === "NotFoundError") {
    return "No microphone was found. Connect a microphone and try again.";
  }
  if (name === "NotReadableError" || name === "AbortError") {
    return "The microphone could not be opened. Check your device settings and whether another app is using it.";
  }
  return error instanceof Error ? error.message : "Could not record audio. Please try again.";
}

export default function useAudioRecorder(onRecordingComplete: RecordingHandler) {
  const [status, setStatus] = useState<RecordingStatus>("idle");
  const [error, setError] = useState("");
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  // Update this ref immediately: React state alone cannot guard rapid clicks.
  const statusRef = useRef<RecordingStatus>("idle");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const urlRef = useRef<string | null>(null);
  const mountedRef = useRef(false);
  const sessionRef = useRef(0);
  const processingRef = useRef<AbortController | null>(null);

  const updateStatus = useCallback((next: RecordingStatus) => {
    statusRef.current = next;
    if (mountedRef.current) setStatus(next);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    const session = sessionRef;
    return () => {
      mountedRef.current = false;
      session.current++;
      processingRef.current?.abort();
      // Leaving the page discards this session instead of uploading it.
      discardRecorder(recorderRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      recorderRef.current = null;
      statusRef.current = "idle";
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, []);

  const toggleRecording = useCallback(async () => {
    if (statusRef.current === "recording") {
      const recorder = recorderRef.current;
      if (recorder && recorder.state !== "inactive") {
        updateStatus("stopping");
        try {
          // stop() emits the final dataavailable event before the stop event.
          recorder.stop();
        } catch (failure) {
          sessionRef.current++;
          discardRecorder(recorder);
          streamRef.current?.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
          recorderRef.current = null;
          setError(microphoneError(failure));
          updateStatus("idle");
        }
      }
      return;
    }
    if (statusRef.current !== "idle") return;

    updateStatus("requesting");
    setError("");
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = null;
    setRecordingUrl(null);
    const session = ++sessionRef.current;
    let stream: MediaStream | null = null;
    const isCurrent = () => mountedRef.current && session === sessionRef.current;

    try {
      if (!window.isSecureContext) {
        throw new Error("Microphone recording requires HTTPS or localhost. Open the app using a secure connection.");
      }
      if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
        throw new Error("Audio recording is unavailable in this browser. Try a current version of Chrome, Edge, Firefox, or Safari.");
      }
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      if (!isCurrent()) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      streamRef.current = stream;
      const mimeType = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"]
        .find((type) => MediaRecorder.isTypeSupported(type));
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      recorderRef.current = recorder;
      const chunks: Blob[] = [];
      const releaseStream = () => {
        stream?.getTracks().forEach((track) => track.stop());
        if (streamRef.current === stream) streamRef.current = null;
        if (recorderRef.current === recorder) recorderRef.current = null;
      };

      recorder.ondataavailable = (event: BlobEvent) => {
        if (isCurrent() && event.data.size > 0) chunks.push(event.data);
      };
      recorder.onerror = () => {
        if (!isCurrent()) return;
        sessionRef.current++;
        discardRecorder(recorder);
        releaseStream();
        setError("The browser could not finish recording. Check your microphone and try again.");
        updateStatus("idle");
      };
      recorder.onstop = async () => {
        releaseStream();
        if (!isCurrent()) return;
        updateStatus("processing");
        const controller = new AbortController();
        processingRef.current = controller;
        try {
          const type = recorder.mimeType || chunks[0]?.type || mimeType;
          if (!type) throw new Error("The browser did not report an audio format. Please try another browser.");
          const audio = new Blob(chunks, { type });
          if (!audio.size) throw new Error("No audio was captured. Record for a few seconds and try again.");
          const url = URL.createObjectURL(audio);
          urlRef.current = url;
          setRecordingUrl(url);
          await onRecordingComplete(audio, controller.signal);
        } catch (failure) {
          if (isCurrent() && !controller.signal.aborted) {
            setError(failure instanceof Error ? failure.message : "Could not process the recording. Please try again.");
          }
        } finally {
          if (processingRef.current === controller) processingRef.current = null;
          if (isCurrent()) updateStatus("idle");
        }
      };
      recorder.start(250);
      updateStatus("recording");
    } catch (failure) {
      stream?.getTracks().forEach((track) => track.stop());
      if (isCurrent()) {
        discardRecorder(recorderRef.current);
        streamRef.current = null;
        recorderRef.current = null;
        setError(microphoneError(failure));
        updateStatus("idle");
      }
    }
  }, [onRecordingComplete, updateStatus]);

  return { status, error, recordingUrl, toggleRecording };
}
