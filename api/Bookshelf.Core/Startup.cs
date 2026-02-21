using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;

namespace Bookshelf.Core
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<BookshelfContext>(options => 
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = Configuration["Jwt:Issuer"],
                    ValidAudience = Configuration["Jwt:Issuer"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Jwt:Key"]))
                };
            });

            services.AddControllers();
            services.AddCors();

            // Configuration
            services.AddSingleton<IJwtConfiguration>(Configuration.GetSection("Jwt").Get<JwtConfiguration>());
            services.AddSingleton<IGoogleBooksConfiguration>(Configuration.GetSection("GoogleBooks").Get<GoogleBooksConfiguration>());
            services.AddSingleton<IEmailConfiguration>(Configuration.GetSection("Email").Get<EmailConfiguration>());
            
            // Services
            services.AddTransient<IEmailService, EmailService>();
            services.AddTransient<ISearchService, SearchService>();

            // Repositories
            services.AddTransient<IBookRepository, BookRepository>();
            services.AddTransient<ICategoryRepository, CategoryRepository>();
            services.AddTransient<IRatingRepository, RatingRepository>();
            services.AddTransient<IUserRepository, UserRepository>();

            // Helpers
            services.AddTransient<IUserHelper, UserHelper>();
            services.AddTransient<ISearchHelper, SearchHelper>();
            services.AddTransient<ISearchMapper, SearchMapper>();
            services.AddTransient<ISearchRunner, SearchRunner>();
            services.AddTransient<IQueryHelper, QueryHelper>();
            services.AddTransient<IEmailHelper, EmailHelper>();

            // Validators
            services.AddTransient<NewBookValidator>();
            services.AddTransient<UpdatedBookValidator>();
            services.AddTransient<CategoryValidator>();
            services.AddTransient<RatingValidator>();
            services.AddTransient<LoginDtoValidator>();
            services.AddTransient<UserDtoValidator>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            using (var serviceScope = app.ApplicationServices.GetService<IServiceScopeFactory>().CreateScope())
            {
                var context = serviceScope.ServiceProvider.GetRequiredService<BookshelfContext>();
                context.Database.Migrate();
            }

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseXContentTypeOptions();
            app.UseXXssProtection(options => options.EnabledWithBlockMode());
            app.UseXfo(options => options.Deny());
            app.UseReferrerPolicy(opts => opts.NoReferrerWhenDowngrade());
            app.UseCsp(options => options.DefaultSources(s => s.Self()));
            app.Use(async (context, next) =>
            {
                context.Response.Headers.Add("Feature-Policy", "geolocation 'none';midi 'none';notifications 'none';push 'none';sync-xhr 'none';microphone 'none';camera 'none';magnetometer 'none';gyroscope 'none';speaker 'self';vibrate 'none';fullscreen 'self';payment 'none';");
                await next.Invoke();
            });

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            app.UseCors(builder =>
                builder
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowAnyOrigin()
            );
        }
    }
}
