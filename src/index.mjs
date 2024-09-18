import { Datastore } from "@google-cloud/datastore";
import { GoogleAuth } from "google-auth-library";
import { execSync } from "child_process";
import fs from "fs";
import _ from "lodash";

const PROJECT_ID = "YOUR_PROJECT_ID";

// Retrieve the access token
execSync(`gcloud config set project ${PROJECT_ID}`);
const ACCESS_TOKEN = execSync("gcloud auth print-access-token")
  .toString()
  .trim();

// Manually set the access token
const authClient = new GoogleAuth();
const client = await authClient.getClient();
client.credentials = { access_token: ACCESS_TOKEN };

// Instantiate Datastore
const datastore = new Datastore({
  projectId: PROJECT_ID,
  authClient: client,
});

// Perform the query
const query = datastore
  .createQuery("EntityName")
  .filter("someField", "=", "someValue")
  .filter("someNumber", ">", 42)
  .order("someOtherField", { descending: true })
  .limit(1000);

const [entities] = await datastore.runQuery(query);
console.log(`Got ${entities.length} entities`);

// Perform any kind of additional processing
const groupedByAnotherFiled = _.groupBy(entities, "anotherField");
const countByAnotherFiled = _.mapValues(groupedByAnotherFiled, (v) => v.length);

const sortedAnotherFieldByCount = _.fromPairs(
  _.toPairs(countByAnotherFiled).sort((a, b) => a[1] - b[1])
);

// If necessary, write something to file so that you can keep analyzing later without hitting Datastore again
fs.writeFileSync(
  "groupedBySomeOtherField.json",
  JSON.stringify(groupedBySomeOtherField, null, 2)
);

// Print whatever feels useful
console.log(sortedAnotherFieldByCount);
