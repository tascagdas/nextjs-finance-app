import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { faker } from '@faker-js/faker'

dotenv.config({ path: '.env.local' })


const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE
)

const categories = ["Other", "House", "Transportation", "Health", "Food", "Education"]

async function Seed() {
    let transactions = []

    for (let index = 0; index < 10; index++) {
        const transaction_date = faker.date.past();
        let type, category = null;

        const typeBias = Math.random();

        if (typeBias < 0.80) {
            type = 'Expense'
            category = faker.helpers.arrayElement(categories)
        } else if (typeBias < 0.90) {
            type = 'Income'
        } else {
            type = faker.helpers.arrayElement(
                ['Saving', 'Investment']
            )
        }

        let amount
        switch (type) {
            case 'Income':
                amount=faker.number.int({min:500,max:20000})
                break;
            case 'Expense':
                amount = faker.number.int({ min: 10, max: 10000 })
                break;
            case 'Investment':
            case 'Saving':
                amount = faker.number.int({ min: 1000, max: 30000 })
                break;
            default:
                break;
        }

        transactions.push({
            transaction_date,
            amount,
            type,
            category,
            description: faker.lorem.sentence({ min: 3, max: 5 })
        })
    }
    const { error } = await supabase.from('transactions').insert(transactions)
    if (error) {
        console.log('Hata oluştu')
    } else {
        console.log('Data seedlendi')
    }
}

Seed().catch(console.error)