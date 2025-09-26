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
        public void GetItems_must_return_all_tasks_that_have_tags()
        {
            TestGetItems(
                completionFilter: null,
                laterFilter: null,
                projectId: null,
                tagFilter: "nonnull",
                completionStatuses: [true, false],
                laterStatuses: [true, false],
                projectIds: null,
                tasksWithNoProject: true,
                tagIds: null,
                tasksWithNoTags: false);
        }

        [Fact]
        public void GetItems_must_return_all_tasks_that_dont_have_tags()
        {
            TestGetItems(
                completionFilter: null,
                laterFilter: null,
                projectId: null,
                tagFilter: "null",
                completionStatuses: [true, false],
                laterStatuses: [true, false],
                projectIds: null,
                tasksWithNoProject: true,
                tagIds: [],
                tasksWithNoTags: true);
        }

        [Fact]
        public void GetItems_must_return_tasks_in_selected_tag_list()
        {
            TestGetItems(
                completionFilter: null,
                laterFilter: null,
                projectId: null,
                tagFilter: "1,null,2",
                completionStatuses: [true, false],
                laterStatuses: [true, false],
                projectIds: null,
                tasksWithNoProject: true,
                tagIds: [1,2],
                tasksWithNoTags: true);
        }

        [Fact]
        public void GetItems_must_return_tasks_from_all_projects_if_non_null_is_specified_in_tag_filters()
        {
            TestGetItems(
                completionFilter: null,
                laterFilter: null,
                projectId: null,
                tagFilter: "1,2,nonnull",
                completionStatuses: [true, false],
                laterStatuses: [true, false],
                projectIds: null,
                tasksWithNoProject: true,
                tagIds: null,
                tasksWithNoTags: false);
        }

        [Fact]
        public void GetItems_must_return_all_tasks_if_both_null_and_nonnull_is_specified_in_tag_filters()
        {
            TestGetItems(
                completionFilter: null,
                laterFilter: null,
                projectId: null,
                tagFilter: "1,null,2,nonnull",
                completionStatuses: [true, false],
                laterStatuses: [true, false],
                projectIds: null,
                tasksWithNoProject: true,
                tagIds: null,
                tasksWithNoTags: true);
        }
        
        [Fact]
        public void GetItems_must_return_no_tasks_if_tagfilters_is_empty()
        {
            TestGetItems(
                completionFilter: null,
                laterFilter: null,
                projectId: null,
                tagFilter: "",
                completionStatuses: [true, false],
                laterStatuses: [true, false],
                projectIds: null,
                tasksWithNoProject: true,
                tagIds: [],
                tasksWithNoTags: false);
        }
    }
}
