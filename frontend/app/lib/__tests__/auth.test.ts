import { beforeEach, describe, expect, it } from "vitest";

import {
  getAccessToken,
  isAuthenticated,
  removeAccessToken,
  setAccessToken,
} from "@/app/lib/auth";

describe("auth helpers", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("getAccessToken", () => {
    it("returns null when no access token exists", () => {
      expect(getAccessToken()).toBeNull();
    });

    it("returns the stored access token", () => {
      localStorage.setItem(
        "taskflow_access_token",
        "test-token",
      );

      expect(getAccessToken()).toBe("test-token");
    });
  });

  describe("setAccessToken", () => {
    it("stores the access token in localStorage", () => {
      setAccessToken("test-token");

      expect(
        localStorage.getItem("taskflow_access_token"),
      ).toBe("test-token");
    });
  });

  describe("removeAccessToken", () => {
    it("removes the access token from localStorage", () => {
      setAccessToken("test-token");

      removeAccessToken();

      expect(getAccessToken()).toBeNull();
    });
  });

  describe("isAuthenticated", () => {
    it("returns false when no access token exists", () => {
      expect(isAuthenticated()).toBe(false);
    });

    it("returns true when an access token exists", () => {
      setAccessToken("test-token");

      expect(isAuthenticated()).toBe(true);
    });
  });
});