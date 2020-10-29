class AuthService {
  redisClient;

  sessionDuration: number;

  singleSession: boolean;

  getUserData: (email: string) => void;

  constructor(
    redisClient,
    sessionDuration: number,
    singleSession: boolean,
    getUserData: (email: string) => void
  ) {
    this.redisClient = redisClient;
    this.sessionDuration = sessionDuration;
    this.singleSession = singleSession;
    this.getUserData = getUserData;
  }

  login(email: string, password: string) {
    this.getUserData("patata");
    return console.log("holi", this.sessionDuration);
  }
}

export default AuthService;
