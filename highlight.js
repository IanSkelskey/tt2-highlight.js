; (function () {
	'use strict'
  
	var hljs = require('highlight.js/lib/highlight')
	
	/**
	 * Included language definitions will be here.
	 * i.e. hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'))
	 * 
	 * This file includes two custom languages:
	 * 1. TT2 Pseudo-Perl (tt2-pseudoperl): Pseudo-Perl used in Template Toolkit
	 * 2. Template Toolkit (tt2): HTML + Pseudo-Perl
	 */

	// Pseudo-Perl inside Template Toolkit
	hljs.registerLanguage('tt2-pseudoperl', function (hljs) {
	  return {
		name: 'TT2 Pseudo-Perl',
  
		contains: [
		  // # or ## line comments
		  hljs.HASH_COMMENT_MODE,
		  // Single and double quoted strings
		  hljs.QUOTE_STRING_MODE,
		  hljs.APOS_STRING_MODE,
		  // Numbers
		  hljs.C_NUMBER_MODE,
  
		  /**
		   * Function calls with optional dot-chaining:
		   *  helpers.get_org_setting(...)   or   foo(...)
		   * We match up to '(' and then highlight the parentheses block separately.
		   */
		  {
			className: 'function',
			// e.g. helpers.get_org_setting( or user.foo(
			// \s* allows optional whitespace before '('
			begin: /(\$?[a-zA-Z_]\w*)\.(\w+)\s*\(/,
			returnBegin: true,
			contains: [
			  {
				// Highlight the variable part (up to '.') as e.g. "variable"
				className: 'variable',
				begin: /(\$?[a-zA-Z_]\w*)/
			  },
			  {
				// Highlight the function name part (after '.') as e.g. "title.function"
				className: 'function',
				begin: /\.(\w+)/,
				excludeBegin: true
			  },
			  {
				// Now match everything inside the parentheses
				begin: /\(/,
				end: /\)/,
				contains: [
				  hljs.QUOTE_STRING_MODE,
				  hljs.APOS_STRING_MODE,
				  hljs.C_NUMBER_MODE,
				  hljs.HASH_COMMENT_MODE
				  // You could also nest the variable rule here if needed
				]
			  }
			]
		  },
  
		  /**
		   * Variables: $foo, $foo.bar, etc.
		   * We first match those with a leading '$', so it won't conflict with keywords like IF.
		   */
		  {
			className: 'variable',
			// e.g. $foo, $foo.bar, $helpers.bar.baz
			begin: /\$[a-zA-Z_]\w*(?:\.[a-zA-Z_]\w*)*/
		  },
  
		  /**
		   * Bare identifiers (without a '$') to highlight as "variables" IF
		   * they're not recognized as keywords or function calls. Example: helpers, user.name
		   * If we place "keywords" at the top level, highlight.js will
		   * color IF/ELSE as keywords, so we won't overshadow them as variables.
		   */
		  {
			className: 'variable',
			// e.g. $foo, or just foo, or user.email
			begin: /(\$?[a-zA-Z_]\w*(?:\.[a-zA-Z_]\w*)*)/,
			keywords: 'IF ELSE ELSIF UNLESS SWITCH CASE FOR FOREACH WHILE NEXT LAST RETURN STOP TRY THROW CATCH END FILTER MACRO SET DEFAULT INSERT INCLUDE PROCESS WRAPPER BLOCK CALL USE DEBUG TAGS'
		  }
		]
	  };
	});
  
	// Template Toolkit (HTML + PseudoPerl)
	hljs.registerLanguage('tt2', function () {
	  return {
		name: 'Template Toolkit (HTML + PseudoPerl)',
		// Outside TT2 blocks → highlight as HTML/XML
		subLanguage: 'xml',
  
		contains: [
		  {
			// This rule matches:
			//   [%   ...   %]
			//   [%-  ...  -%]
			//   (dash optional in start/end)
			begin: '\\[%-?',
			end: '-?%\\]',
			// Instead of "perl", use our custom "tt2-pseudoperl"
			subLanguage: 'tt2-pseudoperl',
  
			// Exclude the [% ... %] delimiters from the child grammar,
			// so the bracket symbols themselves stay styled as HTML.
			excludeBegin: true,
			excludeEnd: true
		  }
		]
	  };
	});
  
	;[].slice.call(document.querySelectorAll('pre code.hljs[data-lang]')).forEach(function (node) {
	  hljs.highlightBlock(node)
	})
  })()
  