using System.Net;
using Backend.Core.Manager;
using Backend.Models;
using Backend.WebApi.ActionFilters;
using Backend.WebApi.Controllers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Moq;
using Shouldly;

namespace Backend.WebApi.Tests.Controller
{
    public partial class ItemsControllerTests
    {
        [Fact]
        public void GetItems_must_return_all_tasks_that_have_project()
        {
            TestGetItems(
                completionFilter: null,
                laterFilter: null,
                projectId: "nonnull",
                tagFilter: null,
                completionStatuses: [true, false],
                laterStatuses: [true, false],
                projectIds: null,
                tasksWithNoProject: false,
                tagIds: null,
                tasksWithNoTags: true);
        }
        
        [Fact]
        public void GetItems_must_return_all_tasks_that_dont_have_project()
        {
            TestGetItems(
                completionFilter: null,
                laterFilter: null,
                projectId: "null",
                tagFilter: null,
                completionStatuses: [true, false],
                laterStatuses: [true, false],
                projectIds: [],
                tasksWithNoProject: true,
                tagIds: null,
                tasksWithNoTags: true);
        }
        
        [Fact]
        public void GetItems_must_return_tasks_in_selected_project_list()
        {
            TestGetItems(
                completionFilter: null,
                laterFilter: null,
                projectId: "1,null,2",
                tagFilter: null,
                completionStatuses: [true, false],
                laterStatuses: [true, false],
                projectIds: [1,2],
                tasksWithNoProject: true,
                tagIds: null,
                tasksWithNoTags: true);
        }
        
        [Fact]
        public void GetItems_must_return_tasks_from_all_projects_if_non_null_is_specified()
        {
            TestGetItems(
                completionFilter: null,
                laterFilter: null,
                projectId: "1,2,nonnull",
                tagFilter: null,
                completionStatuses: [true, false],
                laterStatuses: [true, false],
                projectIds: null,
                tasksWithNoProject: false,
                tagIds: null,
                tasksWithNoTags: true);
        }
        
        [Fact]
        public void GetItems_must_return_all_tasks_if_both_null_and_nonnull_is_specified()
        {
            TestGetItems(
                completionFilter: null,
                laterFilter: null,
                projectId: "1,null,2,nonnull",
                tagFilter: null,
                completionStatuses: [true, false],
                laterStatuses: [true, false],
                projectIds: null,
                tasksWithNoProject: true,
                tagIds: null,
                tasksWithNoTags: true);
        }
        
        [Fact]
        public void GetItems_must_return_no_tasks_if_project_filter_is_empty()
        {
            TestGetItems(
                completionFilter: null,
                laterFilter: null,
                projectId: "",
                tagFilter: null,
                completionStatuses: [true, false],
                laterStatuses: [true, false],
                projectIds: [],
                tasksWithNoProject: false,
                tagIds: null,
                tasksWithNoTags: true);
        }
    }
}
