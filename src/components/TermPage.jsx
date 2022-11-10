import { useState } from "react";
import CourseList from './CourseList';
import Modal from './Modal';
import Cart from './Cart';

const terms = {
  Fall: 'Fall',
  Winter: 'Winter',
  Spring: 'Spring'
};

const TermButton = ({term, selection, setSelection}) => (
  <div>
    <input type="radio" id={term} className="btn-check" checked={term === selection} autoComplete="off"
      onChange={() => setSelection(term)} />
    <label className="btn btn-success mb-1 p-2" htmlFor={term} data-cy={term}>
    { term }
    </label>
  </div>
);

const TermSelector = ({selection, setSelection}) => (
  <div className="btn-group">
    { 
      Object.keys(terms).map(term => <TermButton key={term} term={term} selection={selection} setSelection={setSelection} />)
    }
  </div>
);


const TermPage = ({courses, profile}) => {
    const [selection, setSelection] = useState(() => Object.keys(terms)[0]);
    const [selected, setSelected] = useState([]);
    const [disabled, setDisabled] = useState([]);
    const [open, setOpen] = useState(false);
    

    const openModal = () => setOpen(true);
    const closeModal = () => setOpen(false);

    const dateConflict = (course1, course2) => {
        course1 = splitMeets(course1);
        course2 = splitMeets(course2); 

        return termConflict(course1.term, course2.term) && dayConflict(course1.days, course2.days) && hourConflict(course1.timeStart, course1.timeEnd, course2.timeStart, course2.timeEnd)
    }

    const splitMeets = (course) => {
        const meetsArr = course.meets.split(" ");
        const weekdayArr = meetsArr[0].split(/(?=[A-Z])/);
        const timeArr = meetsArr[1].split("-");
        const startMinutesArr = timeArr[0].split(":");
        const endMinutesArr = timeArr[1].split(":");

        return {
            term: course.term,
            days: weekdayArr, 
            timeStart: parseInt(startMinutesArr[0]) * 60 + parseInt(startMinutesArr[1]),
            timeEnd: parseInt(endMinutesArr[0]) * 60 + parseInt(endMinutesArr[1])
        }
    }

    const termConflict = (term1, term2) => term1 == term2;

    const dayConflict = (dayArr1, dayArr2) => dayArr1.some(e => dayArr2.indexOf(e) >= 0)

    const hourConflict = (timeStart1, timeEnd1, timeStart2, timeEnd2) => Math.max(timeStart1, timeStart2) < Math.min(timeEnd1, timeEnd2);

    const ManageDisabledList = (item) => {
        const disabledArr = Object.entries(courses).filter(([id, course]) => course !== item && dateConflict(item, course)).map(([id, course]) => course);
        
        setDisabled(
            selected.includes(item)
            ? disabled.filter((course) => !disabledArr.includes(course))
            : disabled.concat(disabledArr)
        )
    }

    const toggleSelected = (item) => {
        setSelected(
            selected.includes(item)
            ? selected.filter(x => x !== item)
            : [...selected, item]
        )
        
        ManageDisabledList(item);
    };

    const filteredCourse = Object.entries(courses).filter(([id, course]) => course.term == selection);
    // Object.entries(courses).map(([id, course]) => console.log(course));
    // console.log(Object.entries(courses))
    return (
        <div>
            <TermSelector selection={selection} setSelection={setSelection} />
            <button className="btn btn-outline-dark schedule-btn" onClick={openModal}>
                <i className="bi bi-calendar"></i>
                <span className="schedule-title">course plan</span>
            </button>
            <Modal open={open} close={closeModal}>
                <Cart selected={selected} />
            </Modal>
            <CourseList courses={filteredCourse} selected={selected} toggleSelected={toggleSelected} disabled={disabled} isAdmin={profile.isAdmin}/>
        </div>
    )
};

export default TermPage;