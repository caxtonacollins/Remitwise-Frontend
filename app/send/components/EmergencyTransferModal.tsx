'use client'

import { useState } from 'react'
import { X, AlertTriangle } from 'lucide-react'

interface EmergencyTransferModalProps {
  open: boolean
  onClose: () => void
}

export default function EmergencyTransferModal({
  open,
  onClose,
}: EmergencyTransferModalProps) {
  const [confirmed, setConfirmed] = useState(false)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between bg-red-600 px-6 py-4">
          <div className="flex items-center space-x-2 text-white">
            <AlertTriangle className="w-6 h-6" />
            <h2 className="text-lg font-bold">Emergency Transfer</h2>
          </div>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">

          {/* Warning */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800">
            This transfer will be processed immediately with priority handling.
            Use only in urgent situations.
          </div>

          {/* Recipient */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipient
            </label>
            <input
              type="text"
              disabled
              value="GXXXXXXXXXXXXXXXXXXXXXXXX"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (USD)
            </label>
            <input
              type="number"
              placeholder="250.00"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
                         bg-white text-gray-900 placeholder-gray-400
                         focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          {/* Confirmation */}
          <label className="flex items-start space-x-3 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-1"
            />
            <span>I understand this is an emergency transfer</span>
          </label>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <button
              disabled={!confirmed}
              className={`w-full py-3 rounded-lg font-semibold text-white transition
                ${
                  confirmed
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-red-300 cursor-not-allowed'
                }
              `}
            >
              Send Emergency Transfer
            </button>

            <button
              onClick={onClose}
              className="w-full py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
