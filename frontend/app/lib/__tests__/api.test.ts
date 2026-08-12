import { afterEach, describe, expect, it, vi } from "vitest";

import { apiRequest } from "@/app/lib/api";

describe("apiRequest", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns parsed JSON for a successful response", async () => {
    const mockResponse = {
      id: "123",
      title: "Test task",
    };

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify(mockResponse), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }),
      ),
    );

    const result = await apiRequest<typeof mockResponse>("/tasks");

    expect(result).toEqual(mockResponse);
  });

  it("sends the authorization token when provided", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ id: "123" }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    );

    vi.stubGlobal("fetch", fetchMock);

    await apiRequest("/tasks", {
      token: "test-token",
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [, requestOptions] = fetchMock.mock.calls[0];

    expect(requestOptions.headers).toBeInstanceOf(Headers);

    const headers = requestOptions.headers as Headers;

    expect(headers.get("Authorization")).toBe(
      "Bearer test-token",
    );

    expect(headers.get("Content-Type")).toBe(
      "application/json",
    );
  });

  it("sends the request method and JSON body", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ id: "123" }), {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    );

    vi.stubGlobal("fetch", fetchMock);

    const body = {
      title: "New task",
    };

    await apiRequest("/tasks", {
      method: "POST",
      body: JSON.stringify(body),
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [, requestOptions] = fetchMock.mock.calls[0];

    expect(requestOptions.method).toBe("POST");
    expect(requestOptions.body).toBe(JSON.stringify(body));
  });

  it("throws the API detail message when the request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            detail: "Task not found.",
          }),
          {
            status: 404,
            headers: {
              "Content-Type": "application/json",
            },
          },
        ),
      ),
    );

    await expect(
      apiRequest("/tasks/invalid-id"),
    ).rejects.toThrow("Task not found.");
  });

  it("uses the default error message when the API does not provide detail", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            message: "Not found",
          }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json",
            },
          },
        ),
      ),
    );

    await expect(
      apiRequest("/tasks"),
    ).rejects.toThrow("Something went wrong.");
  });

  it("returns undefined for a 204 response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(null, {
          status: 204,
        }),
      ),
    );

    const result = await apiRequest<void>("/tasks/123", {
      method: "DELETE",
    });

    expect(result).toBeUndefined();
  });
});