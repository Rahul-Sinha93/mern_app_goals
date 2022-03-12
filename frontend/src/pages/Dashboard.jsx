import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {useNavigate} from 'react-router-dom';
import GoalForm  from '../components/GoalForm';
import Spinner from '../components/Spinner';
import { getGoals, reset  } from '../features/goals/goalSlice';
import GoalItem from '../components/GoalItem';


const Dashboard = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state)=> state.auth);
  const { goals, isLoading, isError, message} = useSelector((state) => state.goals)
  
  useEffect(()=> {
    if(isError){
      console.log(message)
    }
    if(!user){
      navigate('/login')
    }

    dispatch(getGoals())

    return () => {
      dispatch(reset())
    }
  },[user,navigate, isError,message,dispatch])

  if(isLoading){
    return <Spinner />
  }

  
  return (
    <>
      <section className='heading'>
          <h1>Welcome {user && user.name} to your</h1>
          <p>Goals Dashboard</p>
          <GoalForm />
          <section className='content'>
            {goals.length > 0 ? (
              <div className='goals'>
                  {goals.map((goal)=> (
                    <GoalItem goal={goal} key={goal._id} />
                  ))}
              </div>
            ) : 
            (<h3>You have not set any Goals</h3>) }

          </section>
      </section>
    </>
  )
}

export default Dashboard