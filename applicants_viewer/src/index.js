import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import {App} from './App';
import "./index.css"
import UniversityStore from "./store/university";
import StudyDirectionStore from "./store/studyDirection";
import ProgramStore from "./store/educationalProgram";
import CompetitionStore from "./store/competitionType";
import StudyModeStore from "./store/studyMode";
import CityStore from "./store/city";

export const ProgramContext = createContext(null)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ProgramContext.Provider value={{
        city: new CityStore(),
        university: new UniversityStore(),
        studyDirection: new StudyDirectionStore(),
        program: new ProgramStore(),
        competition: new CompetitionStore(),
        studyMode: new StudyModeStore()
    }}>
    <App />
    </ProgramContext.Provider>
);
