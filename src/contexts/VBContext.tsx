import { createContext, useContext, useReducer, ReactNode } from 'react';
import { Employee } from '@/types/employee';

export interface Activity {
  id: string;
  title: string;
  description: string;
  date: Date;
  priority: 'high' | 'medium' | 'low';
  responsibleId: string;
  companyId?: string;
  projectId?: string;
  workGroup?: string;
  department?: string;
  type: 'call' | 'meeting' | 'task' | 'other';
  status: 'backlog' | 'pending' | 'in-progress' | 'completed' | 'overdue';
  createdAt: Date;
  completedAt?: string;
  archived?: boolean;
}

// Export the Employee type for backwards compatibility
export type { Employee };

export interface Proposal {
  id: string;
  status: 'negotiating' | 'won' | 'lost';
  totalValue: number;
  createdAt: Date;
}

export interface Company {
  id: string;
  corporateName: string;
  fantasyName: string;
  cnpj: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  companyName?: string;
  city?: string;
  state?: string;
  cep?: string;
  description?: string;
  funnelStage?: string;
  proposals?: Proposal[];
  createdAt: Date;
  updatedAt: Date;
  logo?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  basePrice?: number;
  type?: string;
}

export interface FunnelStage {
  id: string;
  name: string;
  order: number;
  color: string;
}

export interface VBSettings {
  theme: 'light' | 'dark';
  notifications: boolean;
  language: string;
  companyName: string;
  primaryColor: string;
  secondaryColor: string;
  companyLogo?: string;
  departments: string[];
  positions: string[];
  funnelStages: FunnelStage[];
  viewMode: 'kanban' | 'list';
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  avatar?: string;
  role?: string;
}

interface VBState {
  activities: Activity[];
  employees: Employee[];
  companies: Company[];
  products: Product[];
  settings: VBSettings;
  currentUser?: CurrentUser;
}

type VBAction =
  | { type: 'ADD_ACTIVITY'; payload: Activity }
  | { type: 'UPDATE_ACTIVITY'; payload: Partial<Activity> & { id: string } }
  | { type: 'DELETE_ACTIVITY'; payload: string }
  | { type: 'ARCHIVE_ACTIVITY'; payload: string }
  | { type: 'UNARCHIVE_ACTIVITY'; payload: string }
  | { type: 'ADD_EMPLOYEE'; payload: Employee }
  | { type: 'UPDATE_EMPLOYEE'; payload: Employee }
  | { type: 'DELETE_EMPLOYEE'; payload: string }
  | { type: 'ADD_COMPANY'; payload: Company }
  | { type: 'UPDATE_COMPANY'; payload: Company }
  | { type: 'DELETE_COMPANY'; payload: string }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<VBSettings> }
  | { type: 'SET_CURRENT_USER'; payload: CurrentUser };

const initialState: VBState = {
  activities: [
    {
      id: '1',
      title: 'Reunião com cliente',
      description: 'Discussão sobre novos requisitos do projeto',
      date: new Date('2024-01-15'),
      priority: 'high',
      responsibleId: '1',
      companyId: '1',
      type: 'meeting',
      status: 'pending',
      createdAt: new Date('2024-01-10'),
      archived: false
    },
    {
      id: '2',
      title: 'Desenvolver módulo de relatórios',
      description: 'Implementar sistema de geração de relatórios',
      date: new Date('2024-01-20'),
      priority: 'medium',
      responsibleId: '2',
      companyId: '1',
      projectId: '1',
      type: 'task',
      status: 'in-progress',
      createdAt: new Date('2024-01-12'),
      archived: false
    }
  ],
  employees: [
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@empresa.com',
      position: 'Desenvolvedor Frontend',
      department: 'TI',
      role: 'employee',
      phone: '(11) 99999-9999',
      createdAt: new Date('2024-01-01')
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@empresa.com',
      position: 'Gerente de Projetos',
      department: 'TI',
      role: 'manager',
      phone: '(11) 88888-8888',
      createdAt: new Date('2024-01-01')
    }
  ],
  companies: [
    {
      id: '1',
      corporateName: 'TechCorp LTDA',
      fantasyName: 'TechCorp',
      cnpj: '12.345.678/0001-90',
      email: 'contato@techcorp.com',
      phone: '(11) 99999-9999',
      address: {
        street: 'Rua das Flores, 123',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567'
      },
      companyName: 'TechCorp LTDA',
      city: 'São Paulo',
      state: 'SP',
      cep: '01234-567',
      description: 'Empresa de tecnologia especializada em soluções digitais',
      funnelStage: 'stage-1',
      proposals: [
        {
          id: '1',
          status: 'negotiating',
          totalValue: 50000,
          createdAt: new Date('2024-01-15')
        }
      ],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-15')
    }
  ],
  products: [
    {
      id: '1',
      name: 'Sistema CRM',
      description: 'Sistema de gestão de relacionamento com cliente',
      price: 5000,
      category: 'Software',
      stock: 1,
      basePrice: 4000,
      type: 'service'
    }
  ],
  settings: {
    theme: 'light',
    notifications: true,
    language: 'pt-BR',
    companyName: 'VB Solution',
    primaryColor: '#1a1a1a',
    secondaryColor: '#f5f5f5',
    companyLogo: '',
    departments: ['TI', 'Comercial', 'Financeiro', 'RH', 'Operações'],
    positions: ['Desenvolvedor', 'Analista', 'Gerente', 'Diretor', 'Estagiário'],
    funnelStages: [
      { id: 'stage-1', name: 'Prospecção', order: 1, color: '#3b82f6' },
      { id: 'stage-2', name: 'Qualificação', order: 2, color: '#8b5cf6' },
      { id: 'stage-3', name: 'Proposta', order: 3, color: '#f59e0b' },
      { id: 'stage-4', name: 'Negociação', order: 4, color: '#ef4444' },
      { id: 'stage-5', name: 'Fechamento', order: 5, color: '#10b981' }
    ],
    viewMode: 'kanban'
  },
  currentUser: {
    id: '1',
    name: 'João Silva',
    email: 'joao@empresa.com',
    position: 'Desenvolvedor Frontend',
    department: 'TI',
    role: 'developer'
  }
};

function vbReducer(state: VBState, action: VBAction): VBState {
  switch (action.type) {
    case 'ADD_ACTIVITY':
      return { ...state, activities: [action.payload, ...state.activities] };
    case 'UPDATE_ACTIVITY':
      return {
        ...state,
        activities: state.activities.map(activity =>
          activity.id === action.payload.id 
            ? { ...activity, ...action.payload }
            : activity
        )
      };
    case 'DELETE_ACTIVITY':
      return {
        ...state,
        activities: state.activities.filter(activity => activity.id !== action.payload)
      };
    case 'ARCHIVE_ACTIVITY':
      return {
        ...state,
        activities: state.activities.map(activity =>
          activity.id === action.payload ? { ...activity, archived: true } : activity
        )
      };
    case 'UNARCHIVE_ACTIVITY':
      return {
        ...state,
        activities: state.activities.map(activity =>
          activity.id === action.payload ? { ...activity, archived: false } : activity
        )
      };
    case 'ADD_EMPLOYEE':
      return { ...state, employees: [action.payload, ...state.employees] };
    case 'UPDATE_EMPLOYEE':
      return {
        ...state,
        employees: state.employees.map(emp => emp.id === action.payload.id ? action.payload : emp)
      };
    case 'DELETE_EMPLOYEE':
      return {
        ...state,
        employees: state.employees.filter(emp => emp.id !== action.payload)
      };
    case 'ADD_COMPANY':
      return { ...state, companies: [action.payload, ...state.companies] };
    case 'UPDATE_COMPANY':
      return {
        ...state,
        companies: state.companies.map(comp => comp.id === action.payload.id ? action.payload : comp)
      };
    case 'DELETE_COMPANY':
      return {
        ...state,
        companies: state.companies.filter(comp => comp.id !== action.payload)
      };
    case 'ADD_PRODUCT':
      return { ...state, products: [action.payload, ...state.products] };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(prod => prod.id === action.payload.id ? action.payload : prod)
      };
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(prod => prod.id !== action.payload)
      };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    default:
      return state;
  }
}

interface VBContextType {
  state: VBState;
  dispatch: React.Dispatch<VBAction>;
}

const VBContext = createContext<VBContextType | undefined>(undefined);

export const VBProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(vbReducer, initialState);

  return (
    <VBContext.Provider value={{ state, dispatch }}>
      {children}
    </VBContext.Provider>
  );
};

export const useVB = () => {
  const context = useContext(VBContext);
  if (context === undefined) {
    throw new Error('useVB must be used within a VBProvider');
  }
  return context;
};
