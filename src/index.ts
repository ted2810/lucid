import request from '@tedstoychev/request';

enum Domain {
  Dev = 'sandbox.techops.engineering',
  Prod = 'api.samplicio.us'
}

enum Mode {
  Dev = 'development',
  Prod = 'production'
}

enum LogicalOperator {
  Or = 'OR',
  And = 'AND'
}

/**
 * Lucid REST API client.
 */
class Lucid {
  readonly authkey: string;
  readonly domain: Domain;

  constructor(authkey: string, mode: Mode = Mode.Dev) {
    this.authkey = authkey;
    this.domain = mode === Mode.Dev ? Domain.Dev : Domain.Prod;
  }

  /**
   * Returns a list of global system definitions.
   * 
   * Documentation:  
   * https://developer.lucidhq.com/?shell#get-list-global-definitions
   */
  async listGlobalDefinitions(bundle: string) {
    const {authkey, domain} = this;

    const response = await request({
      method: 'GET',
      url: `https://${domain}/Lookup/v1/BasicLookups/BundledLookups/${bundle}`,
      headers: {'Authorization': authkey}
    });

    return response;
  }

  /**
   * Returns a list of all standard questions and question texts
   * for the specified country-language pair.
   * 
   * Documentation:  
   * https://developer.lucidhq.com/?shell#get-list-standard-questions
   */
  async listStandardQuestions(countryLanguageID: number) {
    const {authkey, domain} = this;

    const response = await request({
      method: 'GET',
      url: `https://${domain}/Lookup/v1/QuestionLibrary/AllQuestions/${countryLanguageID}`,
      headers: {'Authorization': authkey}
    });

    return response;
  }

  /**
   * Creates a Marketplace survey.
   * 
   * Documentation:  
   * https://developer.lucidhq.com/?shell#post-create-a-survey
   */
  async createSurvey(
    surveyName: string,
    countryLanguageID: number,
    clientSurveyLiveURL: string
  ) {
    const {authkey, domain} = this;

    const response = await request({
      method: 'POST',
      url: `https://${domain}/Demand/v1/Surveys/Create`,
      headers: {
        'Authorization': authkey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        SurveyName: surveyName,
        CountryLanguageID: countryLanguageID,
        ClientSurveyLiveURL: clientSurveyLiveURL
      })
    });

    return response;
  }

  /**
   * Creates qualification and conditions for an existing Marketplace survey.
   * 
   * Documentation:  
   * https://developer.lucidhq.com/?shell#post-create-a-qualification
   */
  async createQualification(
    surveyNumber: number,
    name: string,
    questionID: number,
    order: number,
    logicalOperator: LogicalOperator = LogicalOperator.Or,
    numberOfRequiredConditions: number = 0,
    isActive: boolean = true,
    preCodes: string[] = []
  ) {
    const {authkey, domain} = this;

    const response = await request({
      method: 'POST',
      url: `https://${domain}/Demand/v1/SurveyQualifications/Create/${surveyNumber}`,
      headers: {
        'Authorization': authkey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        Name: name,
        QuestionID: questionID,
        Order: order,
        LogicalOperator: logicalOperator,
        NumberOfRequiredConditions: numberOfRequiredConditions,
        IsActive: isActive,
        PreCodes: preCodes
      })
    });
  
    return response;
  }
}

export default Lucid;
