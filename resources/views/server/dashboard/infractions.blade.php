@extends('layouts.dashboard')

@section('panel')
    <h2>Infractions</h2>
    <infractions inline-template>
        <div class="table-responsive" :class="{'busy': busy}">
            <table class="table table-bordered infraction-table">
                <thead class="text-center">
                <tr>
                    <th></th>
                    <th colspan="2">User</th>
                    <th colspan="2">Moderator</th>
                    <th colspan="5"></th>
                </tr>
                <tr>
                    <th scope="col" class="infraction-id">ID</th>
                    <!-- User -->
                    <th scope="col">Username#Discrim</th>
                    <th scope="col">User ID</th>
                    <!-- Moderator -->
                    <th scope="col">Username#Discrim</th>
                    <th scope="col">User ID</th>

                    <th scope="col">Type</th>
                    <th scope="col" style="width: 245px">Reason</th>
                    <th scope="col">Active</th>
                    <th scope="col" class="infraction-timestamp">Timestamp</th>
                    <th scope="col" class="infraction-timestamp">Revoked At</th>
                </tr>
                </thead>
                <tbody>
                {{-- Input fields for searching --}}
                <tr>
                    <td><input type="text" class="form-control form-control-sm" v-model="filter.id"
                               @change="getInfractions" @keydown.enter="getInfractions"/></td>
                    <td></td>
                    <td><input type="text" class="form-control form-control-sm" v-model="filter.uid"
                               @change="getInfractions" @keydown.enter="getInfractions"/></td>
                    <td></td>
                    <td><input type="text" class="form-control form-control-sm" v-model="filter.modId"
                               @change="getInfractions" @keydown.enter="getInfractions"></td>
                    <td colspan="5"></td>
                </tr>
                <tr v-if="infractions.data && infractions.data.length === 0">
                    <td colspan="10" class="text-center"><b><i class="fas fa-exclamation-triangle"></i> No Rows Returned</b>
                    </td>
                </tr>
                <tr v-for="inf in infractions.data" v-else>
                    <td><a :href="getInfractionUrl(inf.id)" target="_blank">@{{ inf.id }}</a></td>
                    <td>@{{ inf.user.username+'#'+inf.user.discriminator }}</td>
                    <td>@{{ inf.user.id }}</td>
                    <td>@{{ inf.moderator.username+'#'+inf.moderator.discriminator }}</td>
                    <td>@{{ inf.moderator.id }}</td>
                    <td>@{{ inf.type }}</td>
                    <td><span class="infraction-reason">@{{ inf.reason }}</span></td>
                    <td>@{{ inf.active }}</td>
                    <td>@{{ inf.created_at }}</td>
                    <td>@{{ inf.revoked_at }}</td>
                </tr>
                </tbody>
                <tfoot>
                <tr>
                    <td colspan="10">
                        <button class="btn btn-info" :disabled="infractions.current_page === 1" @click="prevPage"><<
                        </button>
                        <button class="btn btn-info" :disabled="infractions.current_page + 1 > infractions.last_page"
                                @click="nextPage">>>
                        </button>
                        Showing Results @{{ infractions.from }} to @{{ infractions.to }} of @{{ infractions.total }}
                    </td>
                </tr>
                </tfoot>
            </table>
        </div>
    </infractions>

@endsection