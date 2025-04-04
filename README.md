# Decentralized Fishing Quota Management System

A blockchain-based solution for managing fishing quotas in a transparent, efficient, and sustainable manner.

## Overview

This system uses Clarity smart contracts on the Stacks blockchain to create a decentralized approach to fishing quota management. It addresses key challenges in the fishing industry such as quota allocation, monitoring, and trading.

## Contracts

The system consists of four main contracts:

### 1. Vessel Registry Contract (`vessel-registry.clar`)

Manages the registration and tracking of fishing vessels.

**Key Functions:**
- `register-vessel`: Register a new fishing vessel
- `update-vessel-status`: Update a vessel's active status
- `transfer-ownership`: Transfer vessel ownership to a new owner
- `get-vessel`: Retrieve vessel information

### 2. Quota Allocation Contract (`quota-allocation.clar`)

Handles the allocation of fishing quotas by species and season.

**Key Functions:**
- `add-species`: Add a new fish species to the system
- `update-total-allowable-catch`: Update the total allowable catch for a species
- `start-new-season`: Start a new fishing season for a species
- `allocate-quota`: Allocate quota to a vessel
- `get-quota`: Retrieve quota information

### 3. Catch Reporting Contract (`catch-reporting.clar`)

Records and verifies catch reports against allocated quotas.

**Key Functions:**
- `report-catch`: Report a catch for a vessel
- `verify-catch-report`: Verify a catch report (by regulators)
- `get-catch-report`: Retrieve catch report information

### 4. Quota Trading Contract (`quota-trading.clar`)

Facilitates the transfer of unused quotas between vessels.

**Key Functions:**
- `create-offer`: Create a trade offer to sell quota
- `cancel-offer`: Cancel an existing trade offer
- `accept-offer`: Accept a trade offer to buy quota
- `get-offer`: Retrieve trade offer information
- `get-trade`: Retrieve completed trade information

## How It Works

1. **Vessel Registration**: Fishing vessels are registered in the system with details like capacity and ownership.
2. **Quota Allocation**: Regulatory bodies allocate fishing quotas to vessels based on species and seasons.
3. **Catch Reporting**: Vessel owners report their catches, which are verified and deducted from their allocated quotas.
4. **Quota Trading**: Vessel owners can trade unused quotas with other vessels, creating a market-based approach to quota management.

## Benefits

- **Transparency**: All quota allocations and catches are recorded on the blockchain, providing transparency to all stakeholders.
- **Efficiency**: Automated quota management reduces administrative overhead and paperwork.
- **Sustainability**: Better tracking of catches helps ensure compliance with sustainable fishing practices.
- **Market-Based Approach**: Quota trading allows for more efficient use of resources.

## Development

### Prerequisites

- [Clarity language](https://clarity-lang.org/) knowledge
- [Stacks blockchain](https://www.stacks.co/) development environment

### Testing

Tests are implemented using Vitest. To run the tests:

```bash
npm test

