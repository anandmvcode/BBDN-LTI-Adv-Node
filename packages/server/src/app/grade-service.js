import axios from 'axios';
import moment from 'moment';

exports.sendGrade = async (courseId, userId, score, url, token) => {
  const scoresUrl = `${url}/scores`;

  const options = {
    method: 'POST',
    uri: scoresUrl,
    headers: {
      'content-type': 'application/vnd.ims.lis.v2.lineitem+json',
      Authorization: 'Bearer ' + token
    }
  };

  const scoreBody = {
    userId: userId,
    scoreGiven: score ?? null,
    scoreMaximum: 100.0,
    comment: 'This is exceptional work.',
    timestamp: moment().toISOString(),
    activityProgress: 'Completed',
    gradingProgress: 'FullyGraded'
  };

  console.log(`sendGrade body: ${JSON.stringify(scoreBody)} options: ${JSON.stringify(options)}`);

  try {
    const response = await axios.post(scoresUrl, scoreBody, options);

    const grade = response.data;
    console.log(`sendGrade returning ${JSON.stringify(grade)}`);

    return grade;
  } catch (exception) {
    console.log(`Error posting grade ${JSON.stringify(exception)}`);
    return {};
  }
}