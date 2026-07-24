export interface Category {
    id: string;
    name: string;
    color: string; //hexadecimal color or class ionic for the toast
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    categoryId?: string;
    createdAt: number;
}