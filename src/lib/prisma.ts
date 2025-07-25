import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database interface for compatibility with existing code
export const db = {
  user: {
    findUnique: async ({ where }: { where: { id?: string; email?: string } }) => {
      const { data, error } = await supabase
        .from('User')
        .select('*')
        .eq(where.id ? 'id' : 'email', where.id || where.email)
        .single()
      
      if (error) return null
      return data
    },
    
    create: async ({ data }: { data: any }) => {
      const { data: user, error } = await supabase
        .from('User')
        .insert(data)
        .select()
        .single()
      
      if (error) throw error
      return user
    },
    
    update: async ({ where, data }: { where: { id: string }; data: any }) => {
      const { data: user, error } = await supabase
        .from('User')
        .update(data)
        .eq('id', where.id)
        .select()
        .single()
      
      if (error) throw error
      return user
    }
  },
  
  post: {
    findMany: async ({ where = {}, orderBy = {} }: { where?: any; orderBy?: any } = {}) => {
      let query = supabase.from('Post').select('*')
      
      if (where.published !== undefined) {
        query = query.eq('published', where.published)
      }
      if (where.slug) {
        query = query.eq('slug', where.slug)
      }
      if (where.authorId) {
        query = query.eq('authorId', where.authorId)
      }
      
      if (orderBy.createdAt) {
        query = query.order('createdAt', { ascending: orderBy.createdAt === 'asc' })
      }
      
      const { data, error } = await query
      
      if (error) throw error
      return data || []
    },
    
    findUnique: async ({ where }: { where: { id?: string; slug?: string } }) => {
      const { data, error } = await supabase
        .from('Post')
        .select('*')
        .eq(where.id ? 'id' : 'slug', where.id || where.slug)
        .single()
      
      if (error) return null
      return data
    },
    
    create: async ({ data }: { data: any }) => {
      const { data: post, error } = await supabase
        .from('Post')
        .insert(data)
        .select()
        .single()
      
      if (error) throw error
      return post
    },
    
    update: async ({ where, data }: { where: { id: string }; data: any }) => {
      const { data: post, error } = await supabase
        .from('Post')
        .update(data)
        .eq('id', where.id)
        .select()
        .single()
      
      if (error) throw error
      return post
    },
    
    delete: async ({ where }: { where: { id: string } }) => {
      const { error } = await supabase
        .from('Post')
        .delete()
        .eq('id', where.id)
      
      if (error) throw error
    }
  }
}

// Export both supabase and db for compatibility
export { supabase as prisma }