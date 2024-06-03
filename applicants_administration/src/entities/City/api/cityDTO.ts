export class CityDTO {
    city_id: number;
    city_name: string;

    constructor(id: number, name: string) {
        this.city_id = id;
        this.city_name = name;
    }
}