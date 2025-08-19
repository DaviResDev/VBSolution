# 🚀 EXECUTAR MIGRAÇÃO DO SISTEMA DE PERMISSÕES

## 📋 **Código SQL Completo para Copiar:**

```sql
-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  permissions JSONB DEFAULT '{}',
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_roles table for many-to-many relationship
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role_id)
);

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  cnpj TEXT UNIQUE,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  cep TEXT,
  logo_url TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create company_users table for company membership
CREATE TABLE IF NOT EXISTS company_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_owner BOOLEAN DEFAULT FALSE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, user_id)
);

-- Create work_groups table
CREATE TABLE IF NOT EXISTS work_groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3B82F6',
  photo_url TEXT,
  sector TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create work_group_members table
CREATE TABLE IF NOT EXISTS work_group_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  work_group_id UUID REFERENCES work_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  position TEXT,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(work_group_id, user_id)
);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  assigned_to UUID REFERENCES auth.users(id),
  created_by UUID REFERENCES auth.users(id),
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company_name TEXT,
  status TEXT DEFAULT 'new',
  source TEXT,
  assigned_to UUID REFERENCES auth.users(id),
  created_by UUID REFERENCES auth.users(id),
  value DECIMAL(15,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  priority TEXT DEFAULT 'medium',
  start_date DATE,
  end_date DATE,
  assigned_to UUID REFERENCES auth.users(id),
  created_by UUID REFERENCES auth.users(id),
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policies for roles table
CREATE POLICY "Users can view roles" ON roles FOR SELECT USING (true);
CREATE POLICY "Admins can manage roles" ON roles FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() AND r.is_admin = true
  )
);

-- Create policies for user_roles table
CREATE POLICY "Users can view own roles" ON user_roles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can manage user roles" ON user_roles FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() AND r.is_admin = true
  )
);

-- Create policies for companies table
CREATE POLICY "Company members can view company" ON companies FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM company_users cu
    WHERE cu.company_id = companies.id AND cu.user_id = auth.uid()
  )
);
CREATE POLICY "Company owners can manage company" ON companies FOR ALL USING (
  EXISTS (
    SELECT 1 FROM company_users cu
    WHERE cu.company_id = companies.id AND cu.user_id = auth.uid() AND cu.is_owner = true
  )
);

-- Create policies for company_users table
CREATE POLICY "Company members can view company users" ON company_users FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM company_users cu
    WHERE cu.company_id = company_users.company_id AND cu.user_id = auth.uid()
  )
);
CREATE POLICY "Company owners can manage company users" ON company_users FOR ALL USING (
  EXISTS (
    SELECT 1 FROM company_users cu
    WHERE cu.company_id = company_users.company_id AND cu.user_id = auth.uid() AND cu.is_owner = true
  )
);

-- Create policies for work_groups table
CREATE POLICY "Company members can view work groups" ON work_groups FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM company_users cu
    WHERE cu.company_id = work_groups.company_id AND cu.user_id = auth.uid()
  )
);
CREATE POLICY "Company members can manage work groups" ON work_groups FOR ALL USING (
  EXISTS (
    SELECT 1 FROM company_users cu
    WHERE cu.company_id = work_groups.company_id AND cu.user_id = auth.uid()
  )
);

-- Create policies for work_group_members table
CREATE POLICY "Work group members can view members" ON work_group_members FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM work_group_members wgm
    WHERE wgm.work_group_id = work_group_members.work_group_id AND wgm.user_id = auth.uid()
  )
);
CREATE POLICY "Work group members can manage members" ON work_group_members FOR ALL USING (
  EXISTS (
    SELECT 1 FROM work_group_members wgm
    WHERE wgm.work_group_id = work_group_members.work_group_id AND wgm.user_id = auth.uid()
  )
);

-- Create policies for activities table
CREATE POLICY "Company members can view activities" ON activities FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM company_users cu
    WHERE cu.company_id = activities.company_id AND cu.user_id = auth.uid()
  )
);
CREATE POLICY "Company members can manage activities" ON activities FOR ALL USING (
  EXISTS (
    SELECT 1 FROM company_users cu
    WHERE cu.company_id = activities.company_id AND cu.user_id = auth.uid()
  )
);

-- Create policies for leads table
CREATE POLICY "Company members can view leads" ON leads FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM company_users cu
    WHERE cu.company_id = leads.company_id AND cu.user_id = auth.uid()
  )
);
CREATE POLICY "Company members can manage leads" ON leads FOR ALL USING (
  EXISTS (
    SELECT 1 FROM company_users cu
    WHERE cu.company_id = leads.company_id AND cu.user_id = auth.uid()
  )
);

-- Create policies for projects table
CREATE POLICY "Company members can view projects" ON projects FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM company_users cu
    WHERE cu.company_id = projects.company_id AND cu.user_id = auth.uid()
  )
);
CREATE POLICY "Company members can manage projects" FOR ALL USING (
  EXISTS (
    SELECT 1 FROM company_users cu
    WHERE cu.company_id = projects.company_id AND cu.user_id = auth.uid()
  )
);

-- Insert default roles
INSERT INTO roles (name, description, permissions, is_admin) VALUES
('admin', 'Administrador do sistema', '{"all": true}', true),
('editor', 'Editor com permissões de edição', '{"read": true, "write": true, "delete": false}', false),
('viewer', 'Visualizador com permissões de leitura', '{"read": true, "write": false, "delete": false}', false)
ON CONFLICT (name) DO NOTHING;

-- Create function to handle company creation for first user
CREATE OR REPLACE FUNCTION public.handle_first_user_company()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if this is the first user
  IF (SELECT COUNT(*) FROM auth.users) = 1 THEN
    -- Create default company
    INSERT INTO public.companies (name, email, settings)
    VALUES (
      COALESCE(NEW.raw_user_meta_data->>'company', 'Minha Empresa'),
      NEW.email,
      '{"default_language": "pt-BR", "default_timezone": "America/Sao_Paulo", "default_currency": "BRL"}'
    );
    
    -- Get the company ID
    DECLARE
      company_id UUID;
    BEGIN
      SELECT id INTO company_id FROM public.companies WHERE email = NEW.email LIMIT 1;
      
      -- Add user to company as owner
      INSERT INTO public.company_users (company_id, user_id, is_owner)
      VALUES (company_id, NEW.id, true);
      
      -- Assign admin role to first user
      INSERT INTO public.user_roles (user_id, role_id)
      SELECT NEW.id, id FROM public.roles WHERE name = 'admin';
    END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for first user company creation
DROP TRIGGER IF EXISTS on_first_user_company ON auth.users;
CREATE TRIGGER on_first_user_company
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_first_user_company();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER on_roles_updated BEFORE UPDATE ON roles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER on_companies_updated BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER on_work_groups_updated BEFORE UPDATE ON work_groups FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER on_activities_updated BEFORE UPDATE ON activities FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER on_leads_updated BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER on_projects_updated BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

## 🔧 **Como Executar:**

### 1. **Acessar o Supabase:**
- URL: **https://supabase.com/dashboard/project/zqlwthtkjhmjydkeghfh/sql**

### 2. **Executar o Código:**
- Cole todo o código SQL acima
- Clique em **"Run"**
- Aguarde a execução completa

## ✅ **O que esta migração cria:**

- **Sistema de permissões** completo (roles, user_roles)
- **Tabelas de empresa** (companies, company_users)
- **Grupos de trabalho** (work_groups, work_group_members)
- **Atividades, leads e projetos** com isolamento por empresa
- **Políticas de segurança** (RLS) para cada tabela
- **Triggers automáticos** para criação de empresa e perfis
- **Primeiro usuário** automaticamente se torna administrador

## 🎯 **Após executar:**

1. **Teste o cadastro** de um novo usuário
2. **Verifique se** a empresa foi criada automaticamente
3. **Confirme se** o usuário recebeu role de admin
4. **Teste as funcionalidades** do sistema

## 🚨 **Importante:**

- **Execute apenas UMA VEZ**
- **Aguarde** a execução completa
- **Verifique** se não há erros
- **Teste** o sistema após a execução

---

**🎉 Após executar esta migração, todo o sistema estará integrado ao Supabase!**
