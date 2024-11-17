import { EventHandler } from ".";
import { jest } from '@jest/globals';

let handler = new EventHandler();
let hasListenerRun = false;
let listenerDetail;
let listener = () => hasListenerRun = true;
let listener2 = () => { throw Error("This listener was not supposed to run!") };
let listener3 = detail => listenerDetail = detail;

test("handler spawns with no pre-existing listeners", () => {
  expect(Object.keys(handler.listeners).length).toBe(0);
});

test("addEventListener adds a new listener without running it", () => {
  handler.addEventListener("listener", listener);
  expect(hasListenerRun).toBe(false);
  expect(handler.listeners.listener.length).toBe(1);
  expect(handler.listeners.listener[0]).toBe(listener);
})

test("dispatchEvent runs all listeners with type", () => {
  handler.dispatchEvent("listener");
  expect(hasListenerRun).toBe(true);
})

hasListenerRun = false;

test("listeners with other types can be added", () => {
  handler.addEventListener("listener2", listener2);
  expect(handler.listeners.listener2.length).toBe(1);
  expect(handler.listeners.listener2[0]).toBe(listener2);
})

test("dispatchEvent only runs listeners of the specified type", () => {
  expect(() => handler.dispatchEvent("listener")).not.toThrowError();
  expect(hasListenerRun).toBe(true);
})

test("dispatchEvent can handle undefined listener type", () => {
  expect(handler.dispatchEvent).not.toThrowError();
})

hasListenerRun = false;

test("dispatchEvent runs multiple listeners and handles event details", () => {
  const eventDetail = { hello: 'world' };

  handler.addEventListener("listener", listener3);
  handler.dispatchEvent("listener", eventDetail)
  expect(hasListenerRun).toBe(true);
  expect(listenerDetail).toBe(eventDetail);
});

test("removeEventListener removes event listeners", () => {
  expect(handler.listeners.listener2.length).toBe(1);

  handler.removeEventListener("listener2", listener2);
  expect(handler.listeners.listener2).toBeDefined();
  expect(handler.listeners.listener2.length).toBe(0);

  handler.removeEventListener("listener", listener3);
  expect(handler.listeners.listener).toBeDefined();
  expect(handler.listeners.listener.length).toBe(1);
  expect(handler.listeners.listener[0]).toBe(listener);

  handler.removeEventListener("listener", listener3);
  expect(handler.listeners.listener).toBeDefined();
  expect(handler.listeners.listener.length).toBe(0);
});

test("handler supports command chaining", () => {
  expect(() => {
    handler.addEventListener("test", null).dispatchEvent("test").removeEventListener("test", null);
  }).not.toThrowError();
})
