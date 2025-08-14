
import { createContext, useContext, useReducer, ReactNode } from 'react';

export interface Project {
  id: string;
  name: string;
  description: string;
  responsible: string;
  company: string;
  tags: string[];
  status: 'Em Andamento' | 'Concluído' | 'Pausado' | 'Planejado';
  createdAt: string;
  dueDate?: string;
  tasks?: string[]; // IDs das tarefas do projeto
  workGroup?: string;
  department?: string;
  archived?: boolean; // Nova propriedade para projetos arquivados
}

export interface ProjectStage {
  id: string;
  name: string;
  order: number;
  color: string;
}

interface ProjectState {
  projects: Project[];
  projectStages: ProjectStage[];
  workGroups: string[];
  departments: string[];
}

type ProjectAction =
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'ARCHIVE_PROJECT'; payload: string } // Nova ação
  | { type: 'UNARCHIVE_PROJECT'; payload: string } // Nova ação
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'ADD_STAGE'; payload: ProjectStage }
  | { type: 'UPDATE_STAGE'; payload: ProjectStage }
  | { type: 'DELETE_STAGE'; payload: string }
  | { type: 'SET_WORK_GROUPS'; payload: string[] }
  | { type: 'SET_DEPARTMENTS'; payload: string[] };

const initialState: ProjectState = {
  projects: [
    {
      id: '1',
      name: 'Sistema de CRM',
      description: 'Desenvolvimento completo do sistema de CRM para gestão de clientes',
      responsible: 'João Silva',
      company: 'TechCorp',
      tags: ['desenvolvimento', 'sistema', 'crm'],
      status: 'Em Andamento',
      createdAt: '2024-01-15',
      dueDate: '2024-03-15',
      tasks: [],
      workGroup: 'Desenvolvimento',
      department: 'TI',
      archived: false
    },
    {
      id: '2',
      name: 'Campanha Marketing Digital',
      description: 'Campanha completa de marketing digital para novos produtos',
      responsible: 'Maria Santos',
      company: 'MarketingPro',
      tags: ['marketing', 'digital', 'campanha'],
      status: 'Planejado',
      createdAt: '2024-01-20',
      dueDate: '2024-02-28',
      tasks: [],
      workGroup: 'Marketing',
      department: 'Comercial',
      archived: false
    }
  ],
  projectStages: [
    { id: '1', name: 'Backlog', order: 1, color: 'bg-gray-100' },
    { id: '2', name: 'Pendente', order: 2, color: 'bg-yellow-100' },
    { id: '3', name: 'Em Andamento', order: 3, color: 'bg-blue-100' },
    { id: '4', name: 'Finalizado', order: 4, color: 'bg-green-100' },
    { id: '5', name: 'Excluído', order: 5, color: 'bg-red-100' }
  ],
  workGroups: ['Desenvolvimento', 'Marketing', 'Vendas', 'Suporte', 'RH'],
  departments: ['TI', 'Comercial', 'Financeiro', 'Recursos Humanos', 'Operações']
};

function projectReducer(state: ProjectState, action: ProjectAction): ProjectState {
  switch (action.type) {
    case 'ADD_PROJECT':
      return { ...state, projects: [action.payload, ...state.projects] };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(p => p.id === action.payload.id ? action.payload : p)
      };
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(p => p.id !== action.payload)
      };
    case 'ARCHIVE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(p => 
          p.id === action.payload ? { ...p, archived: true } : p
        )
      };
    case 'UNARCHIVE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(p => 
          p.id === action.payload ? { ...p, archived: false } : p
        )
      };
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };
    case 'ADD_STAGE':
      return { ...state, projectStages: [...state.projectStages, action.payload] };
    case 'UPDATE_STAGE':
      return {
        ...state,
        projectStages: state.projectStages.map(s => s.id === action.payload.id ? action.payload : s)
      };
    case 'DELETE_STAGE':
      return {
        ...state,
        projectStages: state.projectStages.filter(s => s.id !== action.payload)
      };
    case 'SET_WORK_GROUPS':
      return { ...state, workGroups: action.payload };
    case 'SET_DEPARTMENTS':
      return { ...state, departments: action.payload };
    default:
      return state;
  }
}

interface ProjectContextType {
  state: ProjectState;
  dispatch: React.Dispatch<ProjectAction>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(projectReducer, initialState);

  return (
    <ProjectContext.Provider value={{ state, dispatch }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
