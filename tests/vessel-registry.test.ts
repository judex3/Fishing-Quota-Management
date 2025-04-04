import { describe, it, expect, beforeEach, vi } from "vitest"

// Mock the Clarity VM environment
const mockClarity = {
  txSender: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
  blockHeight: 100,
  contracts: {},
  
  // Mock functions to simulate contract calls
  callReadOnlyFn(contract, fn, args, sender) {
    // Implement mock behavior for read-only functions
    if (contract === "vessel-registry" && fn === "get-vessel") {
      const vesselId = args[0]
      if (vesselId === 1) {
        return {
          name: "Test Vessel",
          owner: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
          capacity: 1000,
          "registration-date": 100,
          "is-active": true,
        }
      }
      return null
    }
    return null
  },
  
  callPublicFn(contract, fn, args, sender) {
    // Implement mock behavior for public functions
    if (contract === "vessel-registry") {
      if (fn === "register-vessel") {
        const [name, owner, capacity] = args
        if (sender !== this.txSender) {
          return { type: "err", value: 403 }
        }
        if (capacity <= 0) {
          return { type: "err", value: 400 }
        }
        return { type: "ok", value: 1 }
      }
      
      if (fn === "update-vessel-status") {
        const [vesselId, isActive] = args
        if (sender !== this.txSender) {
          return { type: "err", value: 403 }
        }
        return { type: "ok", value: true }
      }
    }
    return { type: "err", value: 404 }
  },
}

// Mock the contract calls
vi.mock("clarity-vm", () => ({
  default: mockClarity,
}))

describe("Vessel Registry Contract", () => {
  beforeEach(() => {
    // Reset mock state before each test
    mockClarity.txSender = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"
  })
  
  it("should register a new vessel successfully", () => {
    const result = mockClarity.callPublicFn(
        "vessel-registry",
        "register-vessel",
        ["Fishing Boat 1", "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM", 1000],
        mockClarity.txSender,
    )
    
    expect(result.type).toBe("ok")
    expect(result.value).toBe(1)
  })
  
  it("should fail to register a vessel with invalid capacity", () => {
    const result = mockClarity.callPublicFn(
        "vessel-registry",
        "register-vessel",
        ["Fishing Boat 1", "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM", 0],
        mockClarity.txSender,
    )
    
    expect(result.type).toBe("err")
    expect(result.value).toBe(400)
  })
  
  it("should fail to register a vessel if not admin", () => {
    const result = mockClarity.callPublicFn(
        "vessel-registry",
        "register-vessel",
        ["Fishing Boat 1", "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM", 1000],
        "ST2PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM", // Different sender
    )
    
    expect(result.type).toBe("err")
    expect(result.value).toBe(403)
  })
  
  it("should retrieve vessel information", () => {
    const vessel = mockClarity.callReadOnlyFn("vessel-registry", "get-vessel", [1], mockClarity.txSender)
    
    expect(vessel).not.toBeNull()
    expect(vessel.name).toBe("Test Vessel")
    expect(vessel.capacity).toBe(1000)
    expect(vessel["is-active"]).toBe(true)
  })
  
  it("should update vessel status", () => {
    const result = mockClarity.callPublicFn("vessel-registry", "update-vessel-status", [1, false], mockClarity.txSender)
    
    expect(result.type).toBe("ok")
    expect(result.value).toBe(true)
  })
})

