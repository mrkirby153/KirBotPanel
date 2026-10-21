<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Redis;
use Tests\TestCase;

class ContainerCompatibilityTest extends TestCase
{
    public function testLoginPageRenders()
    {
        $this->get('/auth/login')->assertOk();
    }

    public function testGuestsAreRedirectedFromServerList()
    {
        $this->get('/servers')->assertRedirect(route('login').'?returnUrl=%2Fservers');
    }

    public function testServerIconCanBeGeneratedWithGd()
    {
        $response = $this->get('/serverIcon?server_name=Test%20Server');
        $response->assertOk();
        $this->assertStringStartsWith('image/', $response->headers->get('Content-Type'));
    }

    public function testExpiredArchiveReturnsNotFound()
    {
        Redis::shouldReceive('get')->once()->with('archive:missing')->andReturn(null);
        $this->get('/archive/missing')->assertStatus(404);
    }
}
