import { renderHook, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "@/contex/AuthContex";
import { ReactNode } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import axiosInstance from "@/utils/axiosInstance";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));
jest.mock("js-cookie");
jest.mock("@/utils/axiosInstance", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
    defaults: {
      headers: {
        common: {},
      },
    },
  },
}));

describe("useAuth", () => {
  const mockRouter = {
    push: jest.fn(),
  };

  const wrapper = ({ children }: { children: ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    axiosInstance.defaults.headers.common = {};
  });

  it("should start with unauthenticated state", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it("should handle login successfully", async () => {
    const mockResponse = {
      data: {
        access_token: "fake-token",
        user: { id: 1, name: "Test User" },
      },
    };

    // mock login berhasil
    (axiosInstance.post as jest.Mock).mockResolvedValueOnce(mockResponse);
    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({
      data: { id: 1, name: "Test User" },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login("test@test.com", "password");
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual({ id: 1, name: "Test User" });
    expect(Cookies.set).toHaveBeenCalledWith(
      "token",
      "fake-token",
      expect.any(Object)
    );
  });

  it("should handle logout", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(Cookies.remove).toHaveBeenCalledWith("token");
  });

  it("should handle login error", async () => {
    // mock login gagal
    (axiosInstance.post as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: "Invalid credentials" } },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await expect(
      act(async () => {
        await result.current.login("test@example.com", "wrong-password");
      })
    ).rejects.toThrow("Invalid credentials");

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it("should handle login failure", async () => {
    const mockError = {
      response: {
        status: 401,
        data: { message: "Invalid credentials" },
      },
    };

    (axiosInstance.post as jest.Mock).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await expect(
      result.current.login("test@test.com", "wrong")
    ).rejects.toThrow("Invalid credentials");
  });
});
