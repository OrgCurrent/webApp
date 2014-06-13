describe('signup', function(){

  describe('failed signup scenarios', function(){
    beforeEach(function(){
      browser.get('http://0.0.0.0:9000/signup');
    });

    it('should disallow email in wrong format', function(){
      element(by.model('user.name')).sendKeys('Hello');
      element(by.model('user.email')).sendKeys('hello this is not an email');
      element(by.model('user.password')).sendKeys('testacular');
      element(by.css('.form')).submit();

      browser.getLocationAbsUrl().then(function(url){
        expect(url).toBe('http://0.0.0.0:9000/signup');
      });

    });


    it('should disallow password shorter than 3 characters', function(){
      element(by.model('user.name')).sendKeys('Marco');
      element(by.model('user.email')).sendKeys('marco@happymeter.com');
      element(by.model('user.password')).sendKeys('hp');
      element(by.css('.form')).submit();

      browser.getLocationAbsUrl().then(function(url){
        expect(url).toBe('http://0.0.0.0:9000/signup');
      });

    });

    it('should disallow signup without name', function(){
      element(by.model('user.email')).sendKeys('marco@happymeter.com');
      element(by.model('user.password')).sendKeys('hp');
      element(by.css('.form')).submit();

      browser.getLocationAbsUrl().then(function(url){
        expect(url).toBe('http://0.0.0.0:9000/signup');
      });

    });

  });
  describe('successful signup', function(){

  });
});
