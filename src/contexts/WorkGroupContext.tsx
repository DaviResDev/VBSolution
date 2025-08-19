import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface WorkGroupMember {
  id: string;
  name: string;
  initials: string;
  email: string;
  position: string;
  avatar?: string;
}

export interface WorkGroup {
  id: string;
  name: string;
  description: string;
  color: string;
  photo?: string;
  sector: string;
  members: WorkGroupMember[];
  tasksCount: number;
  completedTasks: number;
  activeProjects: number;
  createdAt: Date;
  updatedAt: Date;
}

interface WorkGroupContextType {
  workGroups: WorkGroup[];
  addWorkGroup: (workGroup: Omit<WorkGroup, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateWorkGroup: (id: string, updates: Partial<WorkGroup>) => void;
  deleteWorkGroup: (id: string) => void;
  getWorkGroupById: (id: string) => WorkGroup | undefined;
}

const WorkGroupContext = createContext<WorkGroupContextType | undefined>(undefined);

export const useWorkGroup = () => {
  const context = useContext(WorkGroupContext);
  if (context === undefined) {
    throw new Error('useWorkGroup must be used within a WorkGroupProvider');
  }
  return context;
};

interface WorkGroupProviderProps {
  children: ReactNode;
}

// Mock data inicial
const initialWorkGroups: WorkGroup[] = [
  {
    id: '1',
    name: "Marketing Digital",
    description: "Equipe responsável pelas campanhas digitais e redes sociais",
    color: "#3B82F6",
    photo: "",
    sector: "Marketing",
    members: [
      { id: '1', name: "Ana Silva", initials: "AS", email: "ana@exemplo.com", position: "Marketing Manager" },
      { id: '2', name: "Carlos Lima", initials: "CL", email: "carlos@exemplo.com", position: "Social Media" },
      { id: '3', name: "Maria Santos", initials: "MS", email: "maria@exemplo.com", position: "Content Creator" },
      { id: '4', name: "João Costa", initials: "JC", email: "joao@exemplo.com", position: "Designer" }
    ],
    tasksCount: 12,
    completedTasks: 8,
    activeProjects: 3,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: "Desenvolvimento",
    description: "Equipe de desenvolvimento de software e sistemas",
    color: "#10B981",
    photo: "",
    sector: "Tecnologia",
    members: [
      { id: '5', name: "Paulo Oliveira", initials: "PO", email: "paulo@exemplo.com", position: "Tech Lead" },
      { id: '6', name: "Sandra Ferreira", initials: "SF", email: "sandra@exemplo.com", position: "Full Stack Dev" },
      { id: '7', name: "Lucas Mendes", initials: "LM", email: "lucas@exemplo.com", position: "Frontend Dev" }
    ],
    tasksCount: 18,
    completedTasks: 14,
    activeProjects: 5,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: "Vendas",
    description: "Equipe comercial responsável pelas vendas e relacionamento com clientes",
    color: "#F59E0B",
    photo: "",
    sector: "Comercial",
    members: [
      { id: '8', name: "Roberto Dias", initials: "RD", email: "roberto@exemplo.com", position: "Sales Manager" },
      { id: '9', name: "Juliana Costa", initials: "JC", email: "juliana@exemplo.com", position: "Account Executive" }
    ],
    tasksCount: 9,
    completedTasks: 6,
    activeProjects: 2,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date()
  }
];

export const WorkGroupProvider: React.FC<WorkGroupProviderProps> = ({ children }) => {
  const [workGroups, setWorkGroups] = useState<WorkGroup[]>(() => {
    const saved = localStorage.getItem('workGroups');
    return saved ? JSON.parse(saved) : initialWorkGroups;
  });

  // Salvar no localStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem('workGroups', JSON.stringify(workGroups));
  }, [workGroups]);

  const addWorkGroup = (workGroupData: Omit<WorkGroup, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newWorkGroup: WorkGroup = {
      ...workGroupData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setWorkGroups(prev => [newWorkGroup, ...prev]);
  };

  const updateWorkGroup = (id: string, updates: Partial<WorkGroup>) => {
    setWorkGroups(prev => prev.map(group => 
      group.id === id 
        ? { ...group, ...updates, updatedAt: new Date() }
        : group
    ));
  };

  const deleteWorkGroup = (id: string) => {
    setWorkGroups(prev => prev.filter(group => group.id !== id));
  };

  const getWorkGroupById = (id: string) => {
    return workGroups.find(group => group.id === id);
  };

  const value: WorkGroupContextType = {
    workGroups,
    addWorkGroup,
    updateWorkGroup,
    deleteWorkGroup,
    getWorkGroupById,
  };

  return (
    <WorkGroupContext.Provider value={value}>
      {children}
    </WorkGroupContext.Provider>
  );
};
