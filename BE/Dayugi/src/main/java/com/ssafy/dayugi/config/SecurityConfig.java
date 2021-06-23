package com.ssafy.dayugi.config;

import com.ssafy.dayugi.jwt.JwtFilter;
import com.ssafy.dayugi.util.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableGlobalMethodSecurity(securedEnabled = true, prePostEnabled = true)
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig extends WebSecurityConfigurerAdapter{

	private final JwtTokenProvider jwtTokenProvider;

	// 암호화에 필요한 PasswordEncoder 를 Bean 등록합니다.
	@Bean
	public PasswordEncoder passwordEncoder() {
		return PasswordEncoderFactories.createDelegatingPasswordEncoder();
	}

	// authenticationManager를 Bean 등록합니다.
	@Bean
	@Override
	public AuthenticationManager authenticationManagerBean() throws Exception {
		return super.authenticationManagerBean();
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http
				.cors().disable()		//cors방지
				.csrf().disable()		//csrf방지
				.formLogin().disable()	//기본 로그인 페이지 없애기
				.headers().frameOptions().disable();

		http
				.httpBasic().disable()

				.sessionManagement()
				.sessionCreationPolicy(SessionCreationPolicy.STATELESS)

				.and()
				.authorizeRequests()
				.antMatchers(HttpMethod.GET,"/user").authenticated()
				.antMatchers(HttpMethod.DELETE,"/*/user**", "/*/user/**").authenticated()
				.antMatchers(HttpMethod.PUT,"/user").authenticated()

				.antMatchers("/diary").authenticated()
				.antMatchers( "/diary/**").authenticated()
				.antMatchers("/*/diary**").authenticated()
				.antMatchers( "/*/diary/**").authenticated()
				.antMatchers("*/diary**").authenticated()
				.antMatchers("*/diary/**").authenticated()


				.anyRequest().permitAll()

//				.antMatchers("/email").permitAll()
//				.antMatchers("/user/join").permitAll() //토큰 없이 가능
//				.antMatchers("/user/check").permitAll() //토큰 없이 가능
//				.antMatchers(HttpMethod.POST,"/dayugi/user").permitAll()
//				.antMatchers("/user/**").authenticated()

//				.antMatchers("/v2/api-docs","/swagger-resources/**","/swagger-ui.html","/webjars/**","/swagger/**").permitAll() // ,"/csrf"

//				.anyRequest().authenticated()

				.and()
				.addFilterBefore(new JwtFilter(jwtTokenProvider),
						UsernamePasswordAuthenticationFilter.class); // ID, Password 검사 전에 jwt 필터 먼저 수행
	}

	@Override
	public void configure(WebSecurity web) throws Exception {
		web.ignoring().antMatchers("/v2/api-docs", "/swagger-resources/**", "/swagger-ui.html", "/webjars/**", "/swagger/**", "/configuration/**");
	}

}
