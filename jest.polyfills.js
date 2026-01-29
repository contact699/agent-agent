// This file sets up polyfills before any tests run
// It uses require() to ensure synchronous loading

const { TextEncoder, TextDecoder } = require("util");
const { MessageChannel } = require("worker_threads");
const {
  ReadableStream,
  TransformStream,
  WritableStream,
} = require("web-streams-polyfill");

// Create MessagePort from MessageChannel
const channel = new MessageChannel();
const MessagePort = channel.port1.constructor;

Object.defineProperties(globalThis, {
  TextDecoder: { value: TextDecoder },
  TextEncoder: { value: TextEncoder },
  ReadableStream: { value: ReadableStream },
  TransformStream: { value: TransformStream },
  WritableStream: { value: WritableStream },
  MessageChannel: { value: MessageChannel },
  MessagePort: { value: MessagePort },
});

// Now that all dependencies are available, we can load undici
const { fetch, Headers, Request, Response } = require("undici");

Object.defineProperties(globalThis, {
  fetch: { value: fetch, writable: true },
  Headers: { value: Headers },
  Request: { value: Request },
  Response: { value: Response },
});
