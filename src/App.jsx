import { useState } from 'react';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import Banner from './components/Banner';
import TermPage from './components/TermPage';
import CourseEdit from './components/CourseEdit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useJsonQuery } from './utilities/fetch';
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { useDbData } from "./utilities/firebase";
import { useProfile } from './utilities/profile';

const CourseFormForUrl = ({courses}) => {
  const { id } = useParams();

  return <CourseEdit id={id} data={courses[id]} />;
};

const Main = () => {
  const [data, error] = useDbData(`/data`);
  const [profile, profileLoading, profileError] = useProfile();
 

  if (error) return <h1>Error loading course data: {error.toString()}</h1>;
  if (data === undefined) return <h1>Loading course data...</h1>;
  if (!data) return <h1>No course data found. sad</h1>;

  if (profileError) return <h1>Error loading profile: {`${profileError}`}</h1>;
  if (profileLoading) return <h1>Loading user profile</h1>;
  if (!profile) return <h1>No profile data</h1>;

  return (
    <div>   
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <div>
              <Banner title={data.title} />
              <TermPage courses={data.courses} profile={profile}/>
            </div>
          } />
          <Route path="/courses/:id/edit" element={<CourseFormForUrl courses={data.courses}/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

const queryClient = new QueryClient();

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Main />
      </div>
    </QueryClientProvider> 
  );
};

export default App;
