# Rizzo

Rizzo is the UI layer for lonelyplanet.com. Rizzo also serves LP's header and footer, assets and styleguide.

> "Leave code in a better state than you found it."


## Install & Get Dependencies

    $ git clone git@github.com:lonelyplanet/rizzo.git && cd rizzo
    $ cp .rvmrc.example .rvmrc && source .rvmrc
    $ bundle install
    $ npm install


# Table of contents

1. [Rizzo as an application](#raaa)
2. [Rizzo as an engine](#raag)
3. [Rizzo as a service](#raas)
4. [Styleguide](#styleguide)
5. [Testing](#testing)
6. [Images & icons](#images)
7. [Git Guidelines](#git)
8. [Sass Guidelines](#sass)
9. [Javascript Guidelines](#javascript)

-----
<a name="raaa"></a>
## Rizzo as an application

Rizzo is accessible at [http://rizzo.lonelyplanet.com](http://rizzo.lonelyplanet.com) and can also be run locally:

```bash
  bundle exec unicorn
```

<a name="raag"></a>
## Rizzo as an engine

Primarily rizzo is used as an engine to provide layouts and assets to your rails application.

To enable rizzo, add it to your gemfile:

    gem 'rizzo', git: 'git@github.com:lonelyplanet/rizzo.git'

This will add all the Javascript and Sass into your applications load paths. In order to use the layouts, specify it in your controller. There are currently four layouts that Rizzo provides:

- Core (Fixed width) - [http://rizzo.lonelyplanet.com/global](http://rizzo.lonelyplanet.com/global)
- Responsive - [http://rizzo.lonelyplanet.com/responsive](http://rizzo.lonelyplanet.com/responsive)
- Homepage (Transparent header) - [http://rizzo.lonelyplanet.com/homepage](http://rizzo.lonelyplanet.com/homepage)


-----
<a name="raas"></a>
## Rizzo as a service

Rizzo also exposes the Global Head (<head>), Global Body Header (Primary navigation) and Global Body Footer (scripts and footer) as a service. These are used for non-rails apps. They are available at:

- Global Head - [http://rizzo.lonelyplanet.com/global-head](http://rizzo.lonelyplanet.com/global-head)
- Global Body Header - [http://rizzo.lonelyplanet.com/global-body-header](http://rizzo.lonelyplanet.com/global-body-header)
- Global Body Footer - [http://rizzo.lonelyplanet.com/global-body-footer](http://rizzo.lonelyplanet.com/global-body-footer)

An example of the legacy navigation can be viewed at [http://rizzo.lonelyplanet.com/legacy](http://rizzo.lonelyplanet.com/legacy).


-----
<a name="styleguide"></a>
## Styleguide

The styleguide is accessible at 

```bash
  bundle exec unicorn
```

TODO: Write about the styleguide process

@remy is going to write about Yeoman here too :)



-----
<a name="testing"></a>
## Testing

### Unit Tests

Each component as well as any helper methods should have unit tests.

````bash
  $ bundle exec rspec
````

### Integration Tests

````bash
  $ bundle exec cucumber
````

### Javascript Unit Tests

To use grunt with rizzo:

- To clean, compile and run all the tests headlessly
````bash
  $ grunt
````

- To run them headlessly without compiling them all, and to enable watching of files
````bash
  $ grunt dev
````

- To spawn a server and rerun failed tests
````bash
  $ grunt wip
````

- To run plato (Javascript sourcecode analysis)
````bash
  $ grunt report
````

### Visual Regression Tests

Currently a work in progress. Eventually to be run on the styleguide as a pre-push hook. Uses phantomcss.

````bash
  $ phantomjs spec/lib/visual_regression.js
````



-----
<a name="images"></a>
## Images and Icons


The icons are built by a grunt task, `grunt icon`, which uses the Filament Group's [grunticon plugin](https://github.com/filamentgroup/grunticon). To add a new icon to the build step, simply copy the svg file into `rizzo/app/assets/images/icons/active`.

Unfortunately at the moment, our icons depend on a patched version of the grunticon plugin. So, at the moment we must:

```bash
$ cd node_modules/grunt-grunticon
$ curl https://github.com/filamentgroup/grunticon/pull/84.patch | patch -p1
```

Before running `grunt icon` for the first time. You only need to run `grunt icon` if you are building new icons, for the current icons are already checked into git.


-----
<a name="git"></a>
## Git Guidelines

- Always work in a branch
- Avoid long running branches! Merge often.
- Rebase into your own branch from master (as long as it is only you working on that branch)
- Merge with --no-ff back into master when it has been code reviewed.
- Use git pull --rebase to avoid commits like this:

```bash
  Merge remote-tracking branch 'origin/master' into if_feature
````

- Prefix your branches with your initials or name
- Squash your commits using rebase -i if you think it can better reflect the code



-----
<a name="sass"></a>
## Sass Guidelines


### Syntax

We use the Sass format which means:

* 2 spaces (or a soft tab) are used for indentation
* Curly braces are omitted
* Use + instead of @include

Comments are encouraged and should follow the below pattern:

```css
//----------------------------------------------------------
// UI Object Title
//
// Description, modifier classes, styleguide reference 
//----------------------------------------------------------
```

### Style

We use BEM which should help with:
* Limit nesting to 1 level deep.
* Avoid large numbers of nested rules.

Also:
* Group `+` and `@extend` statements at the top of each selector ruleset
* Don't over-abstract too early
* Write code to be readable and understandable, not to save bytes.


### Conventions

We use prefixes for states and javascript hooks:

    <div class="is-hidden">This element has state</div>
    <div class="tab js-tab">This element can be reached by javascript</div>
 
Javascript hooks:
 * Ensures that we maintain a distinction between content and functionality
 * Should *never* relate to css rules
 * Are the only way of reaching a dom element


 -----
<a name="javascript"></a>
## Javascript Guidelines

### Conventions

@chee is going to write this :)


