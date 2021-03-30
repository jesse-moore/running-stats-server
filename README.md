<br />
<p align="center">
  <h1 align="center">Running Stats Server</h3>
  <p align="center">
    A GraphQL api that serves personal running data and a webhook that updates running data when a new run gets created
    <br />
    <br />
    <a href="https://github.com/jesse-moore/running-stats-server/issues/new">Report Bug</a>
</p>

## Technologies
[![Typescript][typescript-badge]][typescript-url]
[![Mongodb][mongodb-badge]][mongodb-url]
[![GraphQL][graphql-badge]][graphql-url]
[![Firebase][firebase-badge]][firebase-url]

## Project Specifications
### GraphQL API
* Serves running stats by year, month or all.
* Serves running data by year, month or all.
* Serve run data by run id.
* Query available stats, returns array of available stats by year and month.
### Webhook
* Saves run id to a new run queue when a new run gets uploaded to Strava.
* **Note**: This webhook needs to respond with a status 200 OK within 2 seconds or Strava may think this webhook is nonresponsive and will stop sending requests, so any processing or recalulating run data needs to happen in a separate function. Therefore this will save the new run id to a queue which will then trigger the update activity by id to start.
### Update Activity by ID Function
* Triggered when a new run id is added to the queue.
* Fetches and parses run data from Strava API.
* Fetches and parses weather data from Virtual Crossing API.
* Recalculates run stats.
* Saves run data and stats to database.

## Roadmap
- [X] ([#20][i20]) Add best effort splits to activities
- [ ] ([#16][i16]) Add fastest splits by 1km, 5km, 10km, 21.1km, and 42.2km to stats.
- [ ] ([#17][i17]) Add top segments to stats.
- [ ] ([#18][i18]) Add weather related stats.
- [ ] ~~([#15][i15]) Populate top activities in stats query~~
- [ ] ([#19][i19]) Fix issue with weather api


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[typescript-url]: https://www.typescriptlang.org
[typescript-badge]: https://img.shields.io/badge/TypeScript-222222?style=flat-square&logo=typescript&logoColor=3178C6
[mongodb-url]: https://www.mongodb.com/
[mongodb-badge]: https://img.shields.io/badge/MongoDB-222222?style=flat-square&logo=mongodb&logoColor=47A248
[graphql-url]: https://graphql.org/
[graphql-badge]: https://img.shields.io/badge/GraphQL-222222?style=flat-square&logo=graphql&logoColor=E10098
[firebase-url]: https://firebase.google.com/
[firebase-badge]: https://img.shields.io/badge/Firebase-222222?style=flat-square&logo=firebase&logoColor=FFCA28
[i16]: https://github.com/jesse-moore/running-stats-server/issues/16
[i15]: https://github.com/jesse-moore/running-stats-server/issues/15
[i17]: https://github.com/jesse-moore/running-stats-server/issues/17
[i18]: https://github.com/jesse-moore/running-stats-server/issues/18
[i19]: https://github.com/jesse-moore/running-stats-server/issues/19
[i20]: https://github.com/jesse-moore/running-stats-server/issues/20




