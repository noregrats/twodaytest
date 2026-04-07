export class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = '[data-test="username"]';
    this.passwordInput = '[data-test="password"]';
    this.loginButton = '[data-test="login-button"]';
  }

  async goto() {
    await this.page.goto("https://www.saucedemo.com/");
  }

  async extractCredentials() {
    const username = await this.page.evaluate(() => {
      const m = document.body.innerText.match(
        /Accepted usernames are:\s*([\w_]+)/,
      );
      return m?.[1] || "standard_user";
    });
    const password = await this.page.evaluate(() => {
      const m = document.body.innerText.match(
        /Password for all users:\s*([\w_]+)/,
      );
      return m?.[1] || "secret_sauce";
    });
    return { username, password };
  }

  async extractCredentialsUser2() {
    const username = await this.page.evaluate(() => {
      const m = document.body.innerText.match(
        /Accepted usernames are:\s*([\w_]+)/,
      );
      return m?.[7] || "visual_user";
    });
    const password = await this.page.evaluate(() => {
      const m = document.body.innerText.match(
        /Password for all users:\s*([\w_]+)/,
      );
      return m?.[1] || "secret_sauce";
    });
    return { username, password };
  }

  async login(username, password) {
    await this.page.fill(this.usernameInput, username);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.loginButton);
  }

  async autoLogin() {
    const { username, password } = await this.extractCredentials();
    await this.login(username, password);
    return { username, password };
  }

  async autoLoginUser2() {
    const { username, password } = await this.extractCredentialsUser2();
    await this.login(username, password);
    console.log(
      `Logged in with username: ${username} and password: ${password}`,
    );
    return { username, password };
  }
}
