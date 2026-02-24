// Transaction builder for remittance split contract
import * as StellarSdk from '@stellar/stellar-sdk';
import { STELLAR_CONFIG } from '../config/stellar';
import { SplitPercentages, validatePercentages, validateStellarAddress } from '../validation/percentages';

export interface TransactionResult {
  xdr: string;
  simulate?: {
    cost: string;
    results: any[];
  };
}

export interface BuildOptions {
  networkPassphrase?: string;
  contractId?: string;
  simulate?: boolean;
  custodialMode?: boolean;
}

/**
 * Builds an unsigned transaction for initializing a remittance split configuration
 * @param owner - Stellar account address that will own the split
 * @param percentages - Split percentages (must sum to 100)
 * @param options - Optional configuration
 * @returns Transaction XDR and optional simulation results
 */
export async function buildInitializeSplitTx(
  owner: string,
  percentages: SplitPercentages,
  options: BuildOptions = {}
): Promise<TransactionResult> {
  // Validate inputs
  validateStellarAddress(owner);
  validatePercentages(percentages);

  const {
    networkPassphrase = STELLAR_CONFIG.networkPassphrase,
    contractId = STELLAR_CONFIG.contractId,
    simulate = false,
    custodialMode = STELLAR_CONFIG.custodialMode,
  } = options;

  if (!contractId) {
    throw new Error('Contract configuration error: Contract ID not set');
  }

  try {
    // Create contract instance
    const contract = new StellarSdk.Contract(contractId);

    // Build the source account
    const sourceAccount = await loadAccount(owner);

    // Build contract invocation operation
    const operation = contract.call(
      'initialize',
      StellarSdk.nativeToScVal(owner, { type: 'address' }),
      StellarSdk.nativeToScVal(percentages.spending, { type: 'u32' }),
      StellarSdk.nativeToScVal(percentages.savings, { type: 'u32' }),
      StellarSdk.nativeToScVal(percentages.bills, { type: 'u32' }),
      StellarSdk.nativeToScVal(percentages.insurance, { type: 'u32' })
    );

    // Build transaction
    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase,
    })
      .addOperation(operation)
      .setTimeout(300) // 5 minutes
      .build();

    let result: TransactionResult = {
      xdr: transaction.toXDR(),
    };

    // Simulate if requested
    if (simulate) {
      try {
        const server = new StellarSdk.SorobanRpc.Server(STELLAR_CONFIG.horizonUrl);
        const simulated = await server.simulateTransaction(transaction);
        
        if (StellarSdk.SorobanRpc.Api.isSimulationSuccess(simulated)) {
          result.simulate = {
            cost: simulated.cost?.toString() || '0',
            results: simulated.results || [],
          };
        }
      } catch (error) {
        console.error('Simulation failed:', error);
        // Continue without simulation results
      }
    }

    // Sign if custodial mode
    if (custodialMode && STELLAR_CONFIG.serverSecretKey) {
      const serverKeypair = StellarSdk.Keypair.fromSecret(STELLAR_CONFIG.serverSecretKey);
      transaction.sign(serverKeypair);
      result.xdr = transaction.toXDR();
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Transaction building failed: ${error.message}`);
    }
    throw new Error('Transaction building failed: Unknown error');
  }
}

/**
 * Builds an unsigned transaction for updating a remittance split configuration
 * @param caller - Stellar account address making the update
 * @param percentages - New split percentages (must sum to 100)
 * @param options - Optional configuration
 * @returns Transaction XDR and optional simulation results
 */
export async function buildUpdateSplitTx(
  caller: string,
  percentages: SplitPercentages,
  options: BuildOptions = {}
): Promise<TransactionResult> {
  // Validate inputs
  validateStellarAddress(caller);
  validatePercentages(percentages);

  const {
    networkPassphrase = STELLAR_CONFIG.networkPassphrase,
    contractId = STELLAR_CONFIG.contractId,
    simulate = false,
    custodialMode = STELLAR_CONFIG.custodialMode,
  } = options;

  if (!contractId) {
    throw new Error('Contract configuration error: Contract ID not set');
  }

  try {
    // Create contract instance
    const contract = new StellarSdk.Contract(contractId);

    // Build the source account
    const sourceAccount = await loadAccount(caller);

    // Build contract invocation operation
    const operation = contract.call(
      'update',
      StellarSdk.nativeToScVal(caller, { type: 'address' }),
      StellarSdk.nativeToScVal(percentages.spending, { type: 'u32' }),
      StellarSdk.nativeToScVal(percentages.savings, { type: 'u32' }),
      StellarSdk.nativeToScVal(percentages.bills, { type: 'u32' }),
      StellarSdk.nativeToScVal(percentages.insurance, { type: 'u32' })
    );

    // Build transaction
    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase,
    })
      .addOperation(operation)
      .setTimeout(300) // 5 minutes
      .build();

    let result: TransactionResult = {
      xdr: transaction.toXDR(),
    };

    // Simulate if requested
    if (simulate) {
      try {
        const server = new StellarSdk.SorobanRpc.Server(STELLAR_CONFIG.horizonUrl);
        const simulated = await server.simulateTransaction(transaction);
        
        if (StellarSdk.SorobanRpc.Api.isSimulationSuccess(simulated)) {
          result.simulate = {
            cost: simulated.cost?.toString() || '0',
            results: simulated.results || [],
          };
        }
      } catch (error) {
        console.error('Simulation failed:', error);
        // Continue without simulation results
      }
    }

    // Sign if custodial mode
    if (custodialMode && STELLAR_CONFIG.serverSecretKey) {
      const serverKeypair = StellarSdk.Keypair.fromSecret(STELLAR_CONFIG.serverSecretKey);
      transaction.sign(serverKeypair);
      result.xdr = transaction.toXDR();
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Transaction building failed: ${error.message}`);
    }
    throw new Error('Transaction building failed: Unknown error');
  }
}

/**
 * Helper function to load account from network
 * For development, creates a mock account if network is unavailable
 */
async function loadAccount(address: string): Promise<StellarSdk.Account> {
  try {
    const server = new StellarSdk.SorobanRpc.Server(STELLAR_CONFIG.horizonUrl);
    const account = await server.getAccount(address);
    return new StellarSdk.Account(account.accountId(), account.sequenceNumber());
  } catch (error) {
    // For development: return mock account if network unavailable
    console.warn('Failed to load account from network, using mock account');
    return new StellarSdk.Account(address, '0');
  }
}
