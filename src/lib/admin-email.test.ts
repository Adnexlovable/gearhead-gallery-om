import { describe, expect, it } from "vitest";
import { isAdminEmail } from "./admin-email";

describe("admin email lock", () => {
  it("allows adnexadmin@gmail.com (any case/spaces)", () => {
    expect(isAdminEmail(" AdnexAdmin@gmail.com ")).toBe(true);
  });
  it("blocks any other email", () => {
    expect(isAdminEmail("adkinadnexsolution@gmail.com")).toBe(false);
    expect(isAdminEmail("someone@example.com")).toBe(false);
  });
});
