import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';
import axios from 'axios';
import { SPARQL_VALUES } from 'src/constants/sparql-constants';

@Injectable()
export class WikiCommunicationService {
    constructor(private httpService: HttpService) {}

    async getHistoricalData(year: string) {
        const endpoint = 'https://query.wikidata.org/sparql';
        const query = `
                SELECT DISTINCT ?item ?itemLabel ?itemDescription ?locationLabel ?coordinates ?wikiArticleUrl
                WHERE
                {
                {
                    ?item p:P580/ps:P580 ?startDate .
                    FILTER(YEAR(?startDate) = ${year})
                } UNION {
                    ?item p:P585/ps:P585 ?date .
                    FILTER(YEAR(?date) = ${year})
                }
                
                ${SPARQL_VALUES}
                
                ?item wdt:P31 ?eventType.
                OPTIONAL { ?item wdt:P276 ?location }
                OPTIONAL { ?item wdt:P625 ?coordinates }
                ?sitelink schema:about ?item;
                        schema:isPartOf <https://en.wikipedia.org/>;
                        schema:name ?wikiArticleName .
                BIND(IRI(CONCAT("https://en.wikipedia.org/wiki/", ENCODE_FOR_URI(?wikiArticleName))) AS ?wikiArticleUrl)
                SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
                }`;

        try {
            const response = await axios.get(endpoint, {
                params: {
                    query: query,
                    format: 'json',
                },
            });

            const uniqueEvents = new Set();
            const formattedResponse = response.data.results.bindings
                .filter((binding: any) => {
                    const itemValue = binding.item.value;
                    if (uniqueEvents.has(itemValue)) {
                        return false;
                    }
                    uniqueEvents.add(itemValue);
                    return true;
                })
                .map((binding: any) => ({
                    item: binding.item.value,
                    itemLabel: binding.itemLabel?.value,
                    itemDescription: binding.itemDescription?.value,
                    locationLabel: binding.locationLabel?.value,
                    coordinates: binding.coordinates?.value,
                    wikiArticleUrl: binding.wikiArticleUrl?.value,
                }));

            return formattedResponse;
        } catch (error) {
            console.error('Error fetching events:', error);
            throw error;
        }
    }

    getCountryBasicData(country: string) {
        const url = `https://restcountries.com/v3.1/name/${country}`;
        return this.httpService.get(url).pipe(map((response) => response.data));
    }

    async getCountriesByYear(year: string) {
        const endpoint = 'https://query.wikidata.org/sparql';
        const query = `
                SELECT DISTINCT ?item ?itemLabel ?inception ?dissolved ?coordinates ?capitalLabel ?wikiArticleUrl
                WHERE
                {
                VALUES ?countryclass { wd:Q3024240 wd:Q6256 wd:Q3624078 }
                ?item p:P31/ps:P31 ?countryclass .
                ?item wdt:P571 ?inception .
                OPTIONAL { ?item wdt:P576 ?dissolved }
                FILTER (?inception < "${year}-01-01T00:00:00Z"^^xsd:dateTime)
                FILTER (?dissolved >= "${year}-01-01T00:00:00Z"^^xsd:dateTime || !Bound(?dissolved) )
                SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en" }
                OPTIONAL { ?item wdt:P625 ?coordinates }
                OPTIONAL {
                    ?sitelink schema:about ?item;
                            schema:isPartOf <https://en.wikipedia.org/>;
                            schema:name ?wikiArticleName;
                    BIND(IRI(CONCAT("https://en.wikipedia.org/wiki/", ENCODE_FOR_URI(?wikiArticleName))) AS ?wikiArticleUrl)
                }
                OPTIONAL { ?item wdt:P36 ?capital . ?capital rdfs:label ?capitalLabel FILTER(LANG(?capitalLabel) = "en") }
            }
            ORDER BY ?inception
            `;

        try {
            const response = await axios.get(endpoint, {
                params: { query: query },
            });

            const countries = response.data.results.bindings.map((item: any) => {
                return {
                    id: item.item.value,
                    name: item.itemLabel.value,
                    inception: item.inception.value,
                    dissolved: item.dissolved ? item.dissolved.value : null,
                    coordinates: item.coor ? item.coor.value : null,
                    capital: item.capitalLabel ? item.capitalLabel.value : null,
                    wikiArticleUrl: item.wikiArticleUrl ? item.wikiArticleUrl.value : null,
                };
            });

            return countries;
        } catch (error) {
            throw error;
        }
    }
}

// births and deaths

// list of countries during a year
// SELECT DISTINCT ?item ?itemLabel ?inception ?dissolved ?coor ?capitalLabel ?wikiArticleUrl
// WHERE
// {
//   VALUES ?countryclass { wd:Q3024240 wd:Q6256 wd:Q3624078 }
//   ?item p:P31/ps:P31 ?countryclass .
//   ?item wdt:P571 ?inception .
//   OPTIONAL { ?item wdt:P576 ?dissolved }
//   FILTER (?inception < "100-01-01T00:00:00Z"^^xsd:dateTime)
//   FILTER (?dissolved >= "100-01-01T00:00:00Z"^^xsd:dateTime || !Bound(?dissolved) )
//   SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en" }
//   OPTIONAL { ?item wdt:P625 ?coor }
//   OPTIONAL {
//     ?sitelink schema:about ?item;
//               schema:isPartOf <https://en.wikipedia.org/>;
//               schema:name ?wikiArticleName;
//     BIND(IRI(CONCAT("https://en.wikipedia.org/wiki/", ENCODE_FOR_URI(?wikiArticleName))) AS ?wikiArticleUrl)
//   }
//   OPTIONAL { ?item wdt:P36 ?capital . ?capital rdfs:label ?capitalLabel FILTER(LANG(?capitalLabel) = "en") }
// }
// ORDER BY ?inception

// get countries on a certain year
// display all events
// draw maps later
// ?every hundred years?
