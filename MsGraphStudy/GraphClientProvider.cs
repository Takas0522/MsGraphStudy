using Microsoft.Graph;
using Microsoft.Identity.Client;
using System;
using System.Collections.Generic;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace MsGraphStudy
{
    public static class GraphClientProvider
    {
        private static IConfidentialClientApplication confidentialClientApp;
        private static IPublicClientApplication publicClientApp;

        private static GraphServiceClient graphClient;

        private static AuthenticationResult authentication;

        public static void MakeConfidtentionalClient(string clientId, string tenantId, string clientSecret)
        {
            confidentialClientApp = ConfidentialClientApplicationBuilder.Create(clientId)
                    .WithAuthority("https://login.microsoftonline.com/" + tenantId)
                    .WithClientSecret(clientSecret)
                    .Build();
        }

        public static void MakePublicClient(string clientId, string tenantId)
        {
            publicClientApp = PublicClientApplicationBuilder.Create(clientId)
                .WithAuthority("https://login.microsoftonline.com/" + tenantId)
                .WithRedirectUri("http://localhost")
                .Build();
        }

        public static async Task<string> GetTokenForConfidentialClientAsync(IEnumerable<string> scopes)
        {
            try
            {
                authentication = await confidentialClientApp.AcquireTokenForClient(scopes).ExecuteAsync();
                return authentication.AccessToken;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public static  async Task<string> GetTokenForPublicClientAsync(IEnumerable<string> scopes)
        {
            try
            {
                authentication = await publicClientApp.AcquireTokenInteractive(scopes).ExecuteAsync();
                return authentication.AccessToken;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public static GraphServiceClient GetGraphServiceClient(IEnumerable<string> scopes)
        {
            if (graphClient == null)
            {
                try
                {
                    graphClient = new GraphServiceClient(
                        new DelegateAuthenticationProvider(
                            async (requestMessage) => {
                                var token = authentication.AccessToken;
                                requestMessage.Headers.Authorization = new AuthenticationHeaderValue("bearer", token);
                            })
                        );
                }
                catch (Exception e)
                {
                    throw e;
                }
            }
            return graphClient;
        }
    }
}
