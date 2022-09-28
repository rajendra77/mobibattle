const errorCodes = {
    1000 : {
        en : "Fail",
        mg : "Fail"
    },
    1001 : {
        en : "Success",
        mg : "Success"
    },
    1002 : {
        en: "Mobibattle Internal Error",
        mg: "Mobibattle Internal Error",
    },
    1003 : {
        en : "Tournament not found",
        mg : "Tournament not found"
    },
    1004 : {
        en : "Tournament cannot be deleted because tournament status is not suitable",
        mg : "Tournament cannot be deleted because tournament status is not suitable"
    },
    1005 : {
        en : "No of days cant be 0",
        mg : "No of days cant be 0"
    },
    1006 : {
        en : "Prize pool not found",
        mg : "Prize pool not found"
    },
    1007 : {
        en : "Can't update status to pending",
        mg : "Can't update status to pending"
    },
    1008 : {
        en : "Can't delete active prize pool",
        mg : "Can't delete active prize pool"
    },
    1009 : {
        en : "Can't update active prize pool",
        mg : "Can't update active prize pool"
    },
    1010 : {
        en : "Prize pool Operator Id mismatched with Tournament Details operator Id",
        mg : "Prize pool Operator Id mismatched with Tournament Details operator Id"
    },
    1011 : {
        en: "Can't update tournament for status",
        mg: "Can't update tournament for status",
    },
    1012 : {
        en : "Tournament dates are not in sorted order",
        mg : "Tournament dates are not in sorted order"
    },
    // 1013:"Tournament result dump not found",
    // 1014:"Rank is repeating for user Id", 
    // 1015:"Total number of kills can't be greater than total number of users",
    // 1016:"Tournament Summary Not Found",
    // 1018:"Result is already Approved so we can't approved again",
    // 1019:"User Profile Not exist For Id", 
    // 1020:"User Profile List Not Found",
    // 1021:"Invalid username/password"
    // 1022:	No Game Found
    // 1023:	Sorry we could not find the battle you were searching for. Please try again in some time.
    // 1024:	Game History Not Found for this user
    // 1025:	Sorry we could not find the profile you were searching for. Please try again in some time.
    // 1026	Your action cannot be processed right now. Please try later on.
    // 1027	The user does not exist
    // 1028	All bots are busy with other users so generate bot or wait
    // 1029	Invalid Operator ID
    // 1030	User not found
    // 1031	Device detail not found
    // 1032	Push failed
    // 1033	User role group not found
    // 1034	User role not found
    // 1035	Role already exist in group
    // 1036	TmpTransaction entry not found
    // 1037	Tournament result comment not found
    // 1038	Insufficent Balance
    // 1039	Battle History Not found for this Battle Request
    // 1040	User Already Exist with same email Id
    // 1041	Tournament List Not Found
    // 1042	Users not exist for this tournament
    // 1043	User Is Not registered For this Tournament
    // 1044	After Submit or reject You can't save the result
    // 1045	No Data Is there as per your request
    // 1046	Operator Mismatched with User Operator
    // 1047	Money is already Withdrawn
    // 1048	Refer Code not found for this device
    // 1049	Notification not found
    // 1050	Number not received
    // 1051	Problem in 24x7 Otp service
    // 1052	Your Otp has been expired.Please Request for new One
    // 1053	Can't Send Otp Because Registration Method is HE
    // 1054	Playing from another device/Problem In Last Game. Please retry after some time.
    // 1055	User is Already Joined For the tournament
    // 1056	Subscription Server is not working
    // 1057	Request is in Pending State
    // 1058	User Not Found for msisdn : 
    // 1059	No Complaint Found for this msisdn
    // 1060	Tournament not found for the msisdn
    // 1061	Game Not Found for the msisdn
    // 1062	Complaint Not Found for msisdn: 
    // 1063	Status is Already: 
    // 1064	User not found for Wallet Id: 
    // 1065	There is no registration found for this unique Id
    // 1066	Failure in Sending sms via operator
    // 1067	User is successfully subscribed but Coins are not added in wallet
    // 1068	User is not subscribed
    // 1069	Wallet Server is not working
    // 1070	Oops! You have made an invalid request . Please try again after some time.
    // 1071	Wrong OTP entered
    // 1072	Something went wrong. Please try again.
    // 1073	Can't Update Configuration. Level is incorrect
    // 1074	Can't Update Configuration. Diff in Last Level End and New Level Start is incorrect at level : 
    // 1075	Can't Update Configuration. Total Expendeture is not 100
    // 1076	Requested Level is not Last Level
    // 1077	Sum of all levels Expenditure is greater than 100
    // 1078	No Levels list found for this operator
    // 1079	No Levels list found in request
    // 1080	Level Start is greater than Level End at level: 
    // 1081	First Level should start from 1 on Level 0
    // 1082	You already claimed the coins
    // 1083	Operator doesn't have gift coins feature
    // 1084	An account already exists with this number. Please enter another number to register your account successfully.
    // 1085	Sorry we could not find the profile you were searching for. Please try again in some time.
    // 1086	User Registerd with other OperatorId
    // 1087	User List is Empty for operatorID and LeaderboardId
    // 1088	No Leaderboard Found
    // 1089	No User Score Found for this UserId and in this Leaderboard
    // 1090	No Award Group Found
    // 1091	No Award List Found
    // 1092	OTP sent successfully
    // 1093	No OTP exist for this msisdn
    // 1094	OTP Type is not same
    // 1095	No User Scores in this Leaderboard
    // 1096	Can't Publish Leaderboard! Leaderboard is not in CLOSED STATE
}

export default errorCodes;