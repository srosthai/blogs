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
    findMany: async ({ where = {}, orderBy = {}, include = {} }: { where?: any; orderBy?: any; include?: any } = {}) => {
      let selectFields = '*'
      
      // Include category information if requested
      if (include.category) {
        selectFields = `*, category:Category(*)`
      }
      if (include.postCategory) {
        selectFields = `*, postCategory:PostCategory(*)`
      }
      if (include.category && include.postCategory) {
        selectFields = `*, category:Category(*), postCategory:PostCategory(*)`
      }
      
      let query = supabase.from('Post').select(selectFields)
      
      if (where.published !== undefined) {
        query = query.eq('published', where.published)
      }
      if (where.slug) {
        query = query.eq('slug', where.slug)
      }
      if (where.authorId) {
        query = query.eq('authorId', where.authorId)
      }
      if (where.categoryId) {
        query = query.eq('categoryId', where.categoryId)
      }
      if (where.postCategoryId) {
        query = query.eq('postCategoryId', where.postCategoryId)
      }
      
      if (orderBy.createdAt) {
        query = query.order('createdAt', { ascending: orderBy.createdAt === 'asc' })
      }
      
      const { data, error } = await query
      
      if (error) throw error
      return data || []
    },
    
    findUnique: async ({ where, include = {} }: { where: { id?: string; slug?: string }; include?: any }) => {
      let selectFields = '*'
      
      // Include category information if requested
      if (include?.category) {
        selectFields = `*, category:Category(*)`
      }
      if (include?.postCategory) {
        selectFields = `*, postCategory:PostCategory(*)`
      }
      if (include?.category && include?.postCategory) {
        selectFields = `*, category:Category(*), postCategory:PostCategory(*)`
      }
      
      const { data, error } = await supabase
        .from('Post')
        .select(selectFields)
        .eq(where.id ? 'id' : 'slug', where.id || where.slug)
        .single()
      
      if (error) return null
      return data
    },
    
    create: async ({ data }: { data: any }) => {
      const postData = {
        title: data.title,
        content: data.content,
        slug: data.slug,
        tags: data.tags || '',
        image: data.image || null,
        published: data.published || false,
        authorId: data.authorId,
        categoryId: data.categoryId || null,
        postCategoryId: data.postCategoryId || null,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      const { data: post, error } = await supabase
        .from('Post')
        .insert(postData)
        .select()
        .single()
      
      if (error) throw error
      return post
    },
    
    update: async ({ where, data }: { where: { id: string }; data: any }) => {
      const updateData = {
        title: data.title,
        content: data.content,
        slug: data.slug,
        tags: data.tags || '',
        image: data.image || null,
        published: data.published,
        categoryId: data.categoryId || null,
        postCategoryId: data.postCategoryId || null,
        updatedAt: new Date().toISOString()
      }
      
      const { data: post, error } = await supabase
        .from('Post')
        .update(updateData)
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
  },

  category: {
    findMany: async ({ where = {}, orderBy = {} }: { where?: any; orderBy?: any } = {}) => {
      let query = supabase.from('Category').select('*')
      
      if (where.status !== undefined) {
        query = query.eq('status', where.status)
      }
      if (where.name) {
        query = query.ilike('name', `%${where.name}%`)
      }
      
      if (orderBy.createdAt) {
        query = query.order('createdAt', { ascending: orderBy.createdAt === 'asc' })
      } else if (orderBy.name) {
        query = query.order('name', { ascending: orderBy.name === 'asc' })
      } else {
        query = query.order('createdAt', { ascending: false })
      }
      
      const { data, error } = await query
      
      if (error) throw error
      return data || []
    },
    
    findUnique: async ({ where }: { where: { id: string } }) => {
      const { data, error } = await supabase
        .from('Category')
        .select('*')
        .eq('id', where.id)
        .single()
      
      if (error) return null
      return data
    },
    
    create: async ({ data }: { data: any }) => {
      const categoryData = {
        name: data.name,
        description: data.description || '',
        status: data.status !== undefined ? Boolean(data.status) : true,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      const { data: category, error } = await supabase
        .from('Category')
        .insert(categoryData)
        .select()
        .single()
      
      if (error) throw error
      return category
    },
    
    update: async ({ where, data }: { where: { id: string }; data: any }) => {
      const updateData = {
        ...data,
        updatedAt: new Date().toISOString()
      }
      
      const { data: category, error } = await supabase
        .from('Category')
        .update(updateData)
        .eq('id', where.id)
        .select()
        .single()
      
      if (error) throw error
      return category
    },
    
    delete: async ({ where }: { where: { id: string } }) => {
      const { error } = await supabase
        .from('Category')
        .delete()
        .eq('id', where.id)
      
      if (error) throw error
    }
  },

  postCategory: {
    findMany: async ({ where = {}, orderBy = {} }: { where?: any; orderBy?: any } = {}) => {
      let query = supabase.from('PostCategory').select('*')
      
      if (where.status !== undefined) {
        query = query.eq('status', where.status)
      }
      if (where.name) {
        query = query.ilike('name', `%${where.name}%`)
      }
      
      if (orderBy.createdAt) {
        query = query.order('createdAt', { ascending: orderBy.createdAt === 'asc' })
      } else if (orderBy.name) {
        query = query.order('name', { ascending: orderBy.name === 'asc' })
      } else {
        query = query.order('createdAt', { ascending: false })
      }
      
      const { data, error } = await query
      
      if (error) throw error
      return data || []
    },
    
    findUnique: async ({ where }: { where: { id: string } }) => {
      const { data, error } = await supabase
        .from('PostCategory')
        .select('*')
        .eq('id', where.id)
        .single()
      
      if (error) return null
      return data
    },
    
    create: async ({ data }: { data: any }) => {
      const postCategoryData = {
        name: data.name,
        description: data.description || '',
        image: data.image || null,
        status: data.status !== undefined ? Boolean(data.status) : true,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      const { data: postCategory, error } = await supabase
        .from('PostCategory')
        .insert(postCategoryData)
        .select()
        .single()
      
      if (error) throw error
      return postCategory
    },
    
    update: async ({ where, data }: { where: { id: string }; data: any }) => {
      const updateData = {
        ...data,
        updatedAt: new Date().toISOString()
      }
      
      const { data: postCategory, error } = await supabase
        .from('PostCategory')
        .update(updateData)
        .eq('id', where.id)
        .select()
        .single()
      
      if (error) throw error
      return postCategory
    },
    
    delete: async ({ where }: { where: { id: string } }) => {
      const { error } = await supabase
        .from('PostCategory')
        .delete()
        .eq('id', where.id)
      
      if (error) throw error
    }
  }
}

// Export both supabase and db for compatibility
export { supabase as prisma }