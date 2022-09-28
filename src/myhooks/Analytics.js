import branch from 'branch-sdk'
import config from '../config/Config';

export function initialiazeBranchIO(callback){
    branch.init(config.get("branchKey"), function(err, data) {
      console.log("<<<<<<<<<<<<<<  branchIO data >>>>>>>>>>>>>",err, data);
      callback(data.data_parsed)
    });
  }