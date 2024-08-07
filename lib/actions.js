'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from './supabase/server'
import { settingsSchema, transactionSchema } from './validation'
import { redirect } from 'next/navigation'

export async function purgeTransactionListCache() {
    revalidateTag('transaction-list')
}

export async function createTransaction(formData) {

    //Validasyonlarla ilgili işlemler.
    const validated = transactionSchema.safeParse(formData)
    if (!validated.success) {
        throw new Error('Geçersiz işlem bilgileri')
    }

    const { error } = await createClient().from('transactions').insert(validated.data)
    if (error) {
        throw new Error('İşlem eklenirken bir hata oluştu. Lütfen tekrar deneyiniz.')
    }
    revalidatePath('/dashboard')

}

export async function fetchTransactions(range, offset = 0, limit = 10) {
    const supabase = createClient();
    let { data, error } = await supabase
        .rpc('fetch_transactions', {
            limit_arg: limit,
            offset_arg: offset,
            range_arg: range
        })
    if (error) throw new Error("can't fetch transactions")

    return data
}


export async function deleteTransaction(id) {
    const supabase = createClient();
    const { error } = await supabase.from('transactions')
        .delete()
        .eq('id', id)
    if (error) throw new Error(`${id} id'li işlem silinemedi.`)
    revalidatePath('/dashboard')
}

export async function updateTransaction(id, formData) {

    const validated = transactionSchema.safeParse(formData)
    if (!validated.success) {
        throw new Error('Geçersiz işlem bilgileri')
    }

    const { error } = await createClient()
        .from('transactions')
        .update(validated.data)
        .eq('id', id)
    if (error) {
        throw new Error('İşlem eklenirken bir hata oluştu. Lütfen tekrar deneyiniz.')
    }
    revalidatePath('/dashboard')

}

export async function login(prevState, formData) {
    const supabase = createClient();
    const email = formData.get('email');
    const { error } = supabase.auth.signInWithOtp({
        email: email,
        options: {
            shouldCreateUser: true
        }
    })

    if (error) {
        return {
            error: true,
            message: 'Kullanıcı doğrulama hatası'
        }
    }
    return {
        message: `${email} adresine mail gönderilmiştir.`
    }
}

export async function signOut() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut()
    redirect('/login')
}

export async function uploadAvatar(prevState, formData) {
    // console.log(formData['file'])
    // if (formData['file']==undefined) {
    //     return {
    //         error: true,
    //         message: 'Lütfen Fotoğraf seçiniz.'
    //     }
    // }
    const supabase = createClient();
    const file = formData.get('file');
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const { data, error } = await supabase
        .storage.from('avatars')
        .upload(fileName, file)
    if (error) {
        return {
            error: true,
            message: 'Fotoğraf yüklenirken hata ile karşılaşıldı.'
        }
    }

    const { data: userData, userError } = await supabase.auth.getUser();
    if (userError) {
        return {
            error: true,
            message: 'Bir sorunla karsilasildi'
        }
    }

    const avatar = userData.user.user_metadata.avatar

    if (avatar) {
        const { error } = await supabase.storage
            .from('avatars')
            .remove([avatar])
        if (error) {
            return {
                error: true,
                message: 'Bir sorunla karsilasildi'
            }
        }
    }
    const { error: dataUpdateError } = await supabase.auth.updateUser({
        data: {
            avatar: fileName
        }
    })
    if (dataUpdateError) {
        return {
            error: true,
            message: 'Yüklenen fotoğraf kullanıcıya atanırken sorun oluştu.'
        }
    }

    return {
        message: 'Profil resmi başarıyla güncellendi.'
    }
}

export async function updateSettings(prevState, formData) {
    const validated = settingsSchema.safeParse({
        fullName: formData.get('fullName'),
        defaultView : formData.get('defaultView')
    })

    if (!validated.success) {
        return {
            errors: validated.error.flatten().fieldErrors
        }
    }

    const supabase = createClient()
    const { error } = await supabase.auth
        .updateUser({
            data: {
                fullName: validated.data.fullName,
                defaultView: validated.data.defaultView
            }
        })

    if (error) {
        return {
            error: true,
            message: 'Ayarlar güncellenirken hata ile karşılaşıldı.',
            errors: {}
        }
    }

    return {
        message: 'Kullanıcı ayarları başarıyla güncellendi.',
        errors: {}
    }
}