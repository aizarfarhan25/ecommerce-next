import axiosInstance from "@/utils/axiosInstance";
import Cookies from "js-cookie";

// Mock js-cookie
jest.mock("js-cookie");

describe("axiosInstance", () => {
  // Test 1: Basic Configuration
  it("should have correct base configuration", () => {
    expect(axiosInstance.defaults.baseURL).toBe(
      "https://api.escuelajs.co/api/v1"
    );
    expect(axiosInstance.defaults.timeout).toBe(10000);
    expect(axiosInstance.defaults.headers["Content-Type"]).toBe(
      "application/json"
    );
  });

  // Test 2: Request Interceptor with Token
  it("should add authorization header when token exists", async () => {
    // Mock token
    (Cookies.get as jest.Mock).mockReturnValue("test-token");

    const config =
      await axiosInstance.interceptors.request.handlers[0].fulfilled({
        headers: {},
      });

    expect(config.headers.Authorization).toBe("Bearer test-token");
  });

  // Test 3: Request Interceptor without Token
  it("should not add authorization header when token does not exist", async () => {
    // Mock no token
    (Cookies.get as jest.Mock).mockReturnValue(null);

    const config =
      await axiosInstance.interceptors.request.handlers[0].fulfilled({
        headers: {},
      });

    expect(config.headers.Authorization).toBeUndefined();
  });
});
