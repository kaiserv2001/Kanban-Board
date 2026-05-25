import { useContext } from 'react';
import { ApplicationContext } from '../context/ApplicationContext.jsx';

export const useApplications = () => useContext(ApplicationContext);
