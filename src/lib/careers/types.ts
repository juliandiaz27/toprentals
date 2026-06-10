export type CareerApplicationStored = {
  id: string;
  createdAt: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  cvUrl: string;
  cvFileName: string;
};

export type CareerApplicationsFile = {
  applications: CareerApplicationStored[];
};
