export default class CompetitionTypeStore {
    constructor() {
        this._competitions = []
        this._filteredCompetitions = []
        this._selectedCompetitionId = {}
    }

    setCompetitions(competitions) {
        this._competitions = competitions
    }

    setFilteredCompetitions(universityId, directionId, programId, studyModeId) {
        this._filteredCompetitions = this._competitions.filter(competition => competition.university_id === universityId
            && competition.direction_id === directionId
            && competition.program_id === programId && competition.study_mode_id === studyModeId)
    }

    setSelectedCompetitionId(competitionId) {
        this._selectedCompetitionId = competitionId
    }

    get allCompetitions() {
        return this._competitions
    }

    get filteredCompetitions() {
        return this._filteredCompetitions
    }

    get selectedCompetitionId() {
        return this._selectedCompetitionId
    }
}