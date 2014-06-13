describe('login', function(){

  beforeEach(function(){
    browser.get('http://0.0.0.0:9000/login');
  });

  describe('successful login', function(){
    beforeEach(function(){
      element(by.model('user.email')).sendKeys('test@test.com');
      element(by.model('user.password')).sendKeys('test');
      element(by.css('.form')).submit();
    });

    it('should login & redirect to home for valid user', function(){
      browser.getLocationAbsUrl().then(function(url){
        expect(url).toBe('http://0.0.0.0:9000/');
      });
    });

    it('should deny login attempt for wrong email/password combo', function(){
      browser.getLocationAbsUrl().then(function(url){
        expect(url).toBe('http://0.0.0.0:9000/login');
      });
    });
  });

});
