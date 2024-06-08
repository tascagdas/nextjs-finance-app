import PageHeader from '@/components/page-header'
import TransactionItem from '@/components/transaction-item'
import Trend from '@/components/trend'


const Page = () => {
  return (
      <main className='space-y-8'>
          <h1 className='text-4xl mt-8'>
              Playground
          </h1>

          <div>
              <h2>PageHeader</h2>
              <hr className='mb-4 border-slate-300 dark:border-slate-700' />
              <div>
                  <PageHeader/>
              </div>
          </div>
          <div>
              <h2>Trend</h2>
              <hr className='mb-4 border-slate-300 dark:border-slate-700' />
              <div className='flex space-x-4'>
                  <Trend type="Income" amount={1000} prevAmount={1100} />
                  <Trend type="Expense" amount={1700} prevAmount={1500} />
                  <Trend type="Investment" amount={300} />
                  <Trend type="Saving" amount={700} />
              </div>
          </div>
          <div>
              <h2>Transferler</h2>
              <hr className='mb-4 border-slate-300 dark:border-slate-700' />
              <div className='space-y-4 '>
                  <TransactionItem type="Income" description="Maaş" amount={17000} />
                  <TransactionItem type="Expense" category="Gıda" description="Dışarıda yemek" amount={7000}/>
                  <TransactionItem type="Saving" category="Kişisel" description="Bilgisayar için" amount={1000}/>
                  <TransactionItem type="Investment" description="Borsa" amount={9000} />
              </div>
          </div>
    </main>
  )
}

export default Page