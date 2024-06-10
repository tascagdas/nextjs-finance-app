import TransactionItem from '@/components/transaction-item'
import TransactionSummaryItem from '@/components/transaction-summary-item'
import React from 'react'

const groupAndSumTransactionsByDate = (transactions) => {
  const grouped = {}
  for (const transaction of transactions) {
    const date = transaction.created_at.split('T')[0]
    if (!grouped[date]) {
      grouped[date] = {
        transactions: [], amount: 0
      }
    }
    grouped[date].transactions.push(transaction)
    const amount = transaction.type == 'Expense' ? - transaction.amount : transaction.amount
    grouped[date].amount += amount
  }
  return grouped
}

const TransactionList = async () => {
  const response = await fetch('http://localhost:3100/transactions'
  )
  const transactions = await response.json()

  const grouped = groupAndSumTransactionsByDate(transactions)

  return (
    <div className='space-y-8'>
      {
        Object.entries(grouped).map(([date, { transactions, amount }]) =>
          <div key={date}>
            <TransactionSummaryItem date={date} amount={amount} />
            <hr className='my-4 border-gray-200 dark:border-gray-600' />
            <section className='space-y-4'>
              {transactions.map(transaction => <div key={transaction.id}>
                <TransactionItem {...transaction} />
              </div>)}
            </section>
          </div>
        )
      }
    </div>
  )
}

export default TransactionList