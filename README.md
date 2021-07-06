### Get Started
Install Meteor

```
curl https://install.meteor.com/ | sh
```

### Development
Launch the app
```
meteor --settings settings-development.json
```

### Deployment
Install `mupx`

```
npm install -g mupx
```

Deploy
```
mupx deploy --settings=settings-development.json
```

or

```
mupx deploy --settings=settings-production.json
```
