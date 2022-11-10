import { Link } from 'react-router-dom';
import { isAuth } from './Banner';

const Course = ({id, course, selected, toggleSelected, disabled, isAdmin}) => (
    <div className="card m-1 p-2" data-cy="course" onClick={() => disabled.includes(course) ? null : toggleSelected(course)}>
        <div className={`card-body ${selected.includes(course) ? 'selected' : ''} ${disabled.includes(course) ? 'disabled' : ''}`}>
        <h5 className="card-title">{course.term} CS {course.number}</h5>
        <p className="card-text">{course.title}</p>
        <hr />
        <p className="card-text">{course.meets}</p>

        { isAdmin ? <p><Link to={`/courses/${id}/edit`}><i className="bi bi-pencil-square"></i></Link></p> : null }
     
        </div>
    </div>
);
  
export default Course;